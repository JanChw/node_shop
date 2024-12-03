import storage from '../common/minio.js'
import multer from 'multer'

const upload = multer({ storage })

export default upload