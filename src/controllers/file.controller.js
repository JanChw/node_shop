export default {
    uploadFile: async(req,res) => {
        console.log(req.file)
        return res.json({
            message: 'upload file'
        })
    }
}