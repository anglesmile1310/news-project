const categorySchema = (joi) => ({
  displayName: joi.string().required(),
  createBy: joi.string().required(),
  createTime: joi.string().empty().default(new Date())
})

module.exports = categorySchema
