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
      .then(async (exists) => {
        if (!exists) {
          await this.minioClient.makeBucket(this.bucketName).catch((err) => {
            logger.error(err)
            logger.error('Failed to create bucket.')
          })

          logger.info('Bucket created.')
        }
        logger.info('Bucket exists.')
      })
      .catch(logger.error)
  }

  // TODO: 添加文件resize compress等功能
  _handleFile(req, file, cb) {
    const fileName = file.originalname

    console.log('file: ', file)

    console.log('fileName: ', fileName)

    this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.stream,
      (err, etag) => {
        if (err) {
          return cb(err)
        }
        cb(null, { path: `${this.bucketName}/${fileName}`, etag })
      }
    )
  }

  _removeFile(req, file, cb) {
    this.minioClient.removeObject(
      this.bucketName,
      file.path.split('/').pop(),
      (err) => {
        if (err) {
          return cb(err)
        }
        cb(null)
      }
    )
  }
}

export default new MinioStorageEngine({
  minioClient: mc,
  bucketName: process.env.MINIO_BUCKET_NAME,
})
