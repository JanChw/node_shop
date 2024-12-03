import { convertToWebp } from '../utils/convert.js'
import * as Minio from 'minio'

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

  // TODO: 添加文件resize compress等功能
  // TODO: 非英文文件名会乱码
  async _handleFile(req, file, cb) {
    const [_fileName, _extName] = file.originalname.split('.')
    const dir = file.mimetype.split('/').shift()
    let data = file.stream
    let fileName = `${dir}/${file.originalname}`

    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      file.mimetype = 'image/webp'
      data = await convertToWebp(data)
      fileName = `${dir}/${_fileName}.webp`
    }

    const result = await this.minioClient
      .putObject(this.bucketName, fileName, data, {
        'Content-Type': file.mimetype,
      })
      .catch(cb)

    cb(null, { path: `${this.bucketName}/${fileName}`, etag: result.etag })
  }

  async _removeFile(req, file, cb) {
    await this.minioClient
      .removeObject(this.bucketName, file.path.split('/').pop())
      .catch(cb)
      
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
