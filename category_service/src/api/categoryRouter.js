const status = require('http-status')
module.exports = (app, container) => {
  const { schemaValidator } = container.resolve('models')
  const categoryRepo = container.resolve('repo')
  const { version } = container.resolve('serverSettings')

  app.post(`/api/${version}/category/add`, (req, res, next) => {
    const newCategory = req.body
    const { user } = req
    if (!user || !user.isAdmin) {
      return res.status(status.FORBIDDEN).json({ msg: "FORBIDDEN!" })
    }
    newCategory.createBy = user._id
    schemaValidator(newCategory, 'category').then(val => {
      categoryRepo.addCategory(val).then(data => {
        const { ops, insertedCount } = data;
        if (insertedCount === 1) {
          res.status(status.OK).json({ Category: ops, msg: "Insert successful!" });
        } else {
          res.status(status.BAD_REQUEST).json({
            msg: "insert failed"
          });
        }
      }).catch(err => next(err))
    }).catch(err => next(err))
  })

  app.get(`/api/${version}/category/:id`, (req, res, next) => {
    const { id } = req.params
    categoryRepo.getCategoryById(id).then(data => {
      res.status(status.OK).json({ msg: "Success!", category: data })
    }).catch(err => next(err))
  })

  app.delete(`/api/${version}/category/:id`, (req, res, next) => {
    const { id } = req.params
    categoryRepo.deleteCategory(id).then(() => {
      res.status(status.OK).json({ msg: 'Success!' })
    }).catch(err => next(err))
  })

  app.put(`/api/${version}/category/:id`, (req, res, next) => {
    const { id } = req.params
    const { user } = req
    if (!user || !user.isAdmin) {
      return res.status(status.FORBIDDEN).json({ msg: "Forbidden!" })
    }
    const { displayName } = req.body
    if (!displayName) {
      return res.status(status.BAD_REQUEST).json({ msg: "Bad request!" })
    }
    categoryRepo.updateCategory({ id, displayName, iduser: req.user._id }).then((data) => {
      res.status(status.OK).json({ msg: 'Success!', data })
    }).catch(err => next(err))
  })
}