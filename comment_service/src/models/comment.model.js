const commentSchema = (joi) => ({
    createBy: joi.string().required(),
    content: joi.string().min(1).required(),
    fromPost: joi.string().required(),
    createTime: joi.string().empty().default(new Date())
})

module.exports = commentSchema
