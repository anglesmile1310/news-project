const status = require('http-status')
module.exports = (app, container) => {
    const { schemaValidator } = container.resolve('models')
    const commentRepo = container.resolve('repo')
    const { version } = container.resolve('serverSettings')

    app.post(`/api/${version}/comment/add`, (req, res, next) => {
        const newComment = req.body
        const { user } = req
        if (!user || !user.isAdmin) {
            return res.status(status.FORBIDDEN).json({ msg: "FORBIDDEN!" })
        }
        newComment.createBy = user._id
        schemaValidator(newComment, 'comment').then(val => {
            commentRepo.addComment(val).then(data => {
                res.status(status.OK).json({ msg: "Success!", category: data })
            }).catch(err => next(err))
        }).catch(err => next(err))
    })

    app.get(`/api/${version}/comment/:id`, (req, res, next) => {
        const { id } = req.params
        commentRepo.getCommentById(id).then(data => {
            res.status(status.OK).json({ msg: "Success!", comment: data })
        }).catch(err => next(err))
    })

    app.get(`/api/${version}/comment/getCommentByPost/:id`, (req, res) => {
        const { id } = req.params;
        postRepo.getCommentByIdPost(id).then(data => {
            res.status(status.OK).json({ msg: "Get Comment by PostId Success!", data });
        }).catch(err => next(err));
    });

    app.delete(`/api/${version}/comment/:id`, (req, res, next) => {
        const { id } = req.params
        commentRepo.deleteComment(id).then(() => {
            res.status(status.OK).json({ msg: 'Success!' })
        }).catch(err => next(err))
    })

    app.put(`/api/${version}/comment/:id`, (req, res, next) => {
        const { id } = req.params
        const { user } = req
        if (!user || !user.isAdmin) {
            return res.status(status.FORBIDDEN).json({ msg: "Forbidden!" })
        }
        const { content } = req.body
        if (!content) {
            return res.status(status.BAD_REQUEST).json({ msg: "Bad request!" })
        }
        commentRepo.updateComment({ id, content, iduser: req.user._id }).then(() => {
            res.status(status.OK).json({ msg: 'Success!' })
        }).catch(err => next(err))
    })
}