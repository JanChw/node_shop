export default {
    
    uploadFile: async(req,res) => {
        return res.json({
            success: true,
            message: '上传成功',
            data: {
                url: `http://localhost:3000/uploads/${req.absolutePath}`
            }
        })
    },

    uploadFiles: async(req,res) => {
       
    }
}