module.exports = (app, container) => {
  const { schemaValidator } = container.resolve("models");
  const { version } = container.resolve("serverSettings");
  const postRepo = container.resolve("repo");
  app.post(`/api/${version}/post/add`, (req, res, next) => {
    const newPost = req.body;
    const { user } = req;
    if (!user || !user.isAdmin) {
      return res.status(status.FORBIDDEN).json({ msg: "FORBIDDEN!" })
    }
    newPost.owner = req.user._id;
    if (typeof newPost.categories !== typeof [] && newPost.categories) {
      newPost.categories = [newPost.categories];
    } else {
      newPost.categories = [];
    }
    schemaValidator(newPost, "post").then(val => {
      postRepo.addPost(val).then(data => {
        const { ops, insertedCount, ok } = data;
        if (insertedCount === 1) {
          res.status(status.OK).json({ Post: ops, msg: "Insert successful!" });
        } else {
          res.status(status.BAD_REQUEST).json({
            msg: "insert failed"
          });
        }
      }).catch(err => next(err));
    }).catch(err => next(err));
  });


  app.get(`/api/${version}/post/:id`, (req, res, next) => {
    const { id } = req.params;
    postRepo.getPostById(id).then(data => {
      res.status(status.OK).json({ msg: 'Success!', data })
    }).catch(err => next(err));
  });

  app.get(`/api/${version}/post/getByUser/:id`, (req, res, next) => {
    const { id } = req.params;
    postRepo.getPostByIdUser(id).then(data => {
      res.status(status.OK).json({ msg: 'Success!', data })
    }).catch(err => next(err));
  });

  app.get(`/api/${version}/post/getByCategory/:id`, (req, res, next) => {
    const { id } = req.params;
    postRepo.getPostByIdCategory(id).then(data => {
      res.status(status.OK).json({ msg: 'Success!', data })
    }).catch(err => next(err));
  });

  app.delete(`/api/${version}/post/:id`, (req, res, next) => {
    const { id } = req.params;
    const { user } = req
    if (!user || !user.isAdmin) {
      return res.status(status.FORBIDDEN).json({ msg: "Forbidden!" })
    }
    postRepo.deletePost(id).then(() => {
      res.status(status.OK).json({ msg: 'Success!' })
    }).catch(err => next(err));
  });

  app.put(`/api/${version}/post/:id`, (req, res, next) => {
    const { id } = req.params;
    const { user } = req
    if (!user || !user.isAdmin) {
      return res.status(status.FORBIDDEN).json({ msg: "Forbidden!" })
    }
    const { title, content, categories, description } = req.body;
    if (!title || !content || !categories) {
      return res.status(status.BAD_REQUEST).json({ msg: "Bad request!" })
    }
    postRepo.updatePost({
      id,
      title,
      content,
      categories,
      description,
      iduser: req.user._id
    }).then(() => {
      res.status(status.OK).json({ msg: 'Success!', data })
    }).catch(err => next(err));
  });
};
