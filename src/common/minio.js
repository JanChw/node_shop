import { convertToWebp } from '../utils/convert.js'
import * as Minio from 'minio'
import sharp from 'sharp'

const sizes = ['lg', 'md', 'sm', 'xs', 'thumb']

export const mc = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

export class MinioStorageEngine {
  constructor(options) {
    this.minioClient = options.minioClient
    this.bucketName = options.bucketName

    // 确保桶存在
    this.minioClient
      .bucketExists(this.bucketName)
      .then(async exists => {
        if (!exists) {
          await this.minioClient.makeBucket(this.bucketName).catch(err => {
            logger.error(err)
            logger.error('Failed to create bucket.')
          })
          // 设置桶的访问策略为公共读
          await setPublicPolicy(this.minioClient, this.bucketName)
          logger.info('Bucket created.')
        }
        logger.info('Bucket exists.')
      })
      .catch(logger.error)
  }

  // TODO: 图片剪裁放到任务队列中处理
  // TODO: 非英文文件名会乱码
  async _handleFile(req, file, cb) {
    let [_fileName, _extName] = file.originalname.split('.')
    const dir = file.mimetype.split('/').shift()
    let data = file.stream
    let fileName = `${dir}/${file.originalname}`

    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      file.mimetype = 'image/webp'
      data = await convertToWebp(data)
      _extName = 'webp'
      fileName = `${dir}/${_fileName}.${_extName}`
    }

    // lg width 1080
    // md width 768
    // sm width 540
    // xs width 360
    // thumb width 180
    const pms = [
      sharp(data).resize(1080).toBuffer(),
      sharp(data).resize(768).toBuffer(),
      sharp(data).resize(540).toBuffer(),
      sharp(data).resize(360).toBuffer(),
      sharp(data).resize(180).toBuffer(),
    ]
    const resizes = await Promise.all(pms)

    let obj = {}

    sizes.forEach((val, index) => {
      obj[val] = resizes[index]
    })
    obj['orgin'] = data

    let objs = Object.entries(obj).map(([key, value]) => {
      let filePath = `${dir}/${_fileName}.${_extName}`
      if (key !== 'orgin') {
        filePath = `${dir}/${_fileName}-${key}.${_extName}`
      }

      return this.minioClient.putObject(this.bucketName, filePath, value, {
        'Content-Type': file.mimetype,
      })
    })

    const result = await Promise.all(objs).catch(cb)

    cb(null, { path: `${this.bucketName}/${fileName}`, etag: result[0].etag })
  }

  async _removeFile(req, file, cb) {
    let originalname = file.path.split('/').pop()
    let removeOriginFile = this.minioClient
      .removeObject(this.bucketName, originalname)
    let removes = sizes.map(val => this.minioClient.removeObject(this.bucketName, `${originalname.split('.')[0]}-${val}.${originalname.split('.')[1]}`))  

    await Promise.all([removeOriginFile,...removes]).catch(cb)
    
    cb(null)
  }
}

export default new MinioStorageEngine({
  minioClient: mc,
  bucketName: process.env.MINIO_BUCKET_NAME,
})

async function setPublicPolicy(mc, bucketName) {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  }

  await mc
    .setBucketPolicy(bucketName, JSON.stringify(policy))
    .catch(logger.error)
  logger.info(`Bucket ${bucketName} is now publicly readable.`)
}
