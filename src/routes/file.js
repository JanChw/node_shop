import router from './initRoute.js'
import FileController from '../controllers/file.controller.js'
import upload from '../middlewares/fileUpload.js'

router.post('/upload', upload.single('file'), FileController.uploadFile)