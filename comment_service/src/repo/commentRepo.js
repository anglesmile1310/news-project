module.exports = function (mongoClient, options) {
    const { ObjectId } = options

    const createIndex = () => {
        mongoClient.createCollection('comments', (error) => {
            if (error) {
                return console.error(error)
            }
            mongoClient.collection('comments').createIndex('content', { unique: true })
        })
    }

    createIndex()
    const addComment = (comment) => {
        return new Promise((resolve, reject) => {
            comment.createBy = new ObjectId(comment.createBy)
            mongoClient.collection('comments').insertOne(comment, (err, data) => {
                if (err) reject(new Error(err))
                else {
                    const { result } = data
                    if (result.ok) {
                        resolve(data)
                    } else {
                        reject(new Error('Không thể thêm Comment.'))
                    }
                }
            })
        })
    }
    const getCommentById = (id) => {
        return new Promise((resolve, reject) => {
            mongoClient.collection('comments').findOne({ _id: new ObjectId(id) }, (err, data) => {
                err ? reject(new Error(err)) : resolve(data)
            })
        })
    }
    const getCommentByIdPost = (id) => {
        return new Promise((resolve, reject) => {
            mongoClient.collection('comments').findOne({ _id: new ObjectId(id) }, (err, data) => {
                err ? reject(new Error(err)) : resolve(data)
            })
        })
    }
    const deleteComment = (id) => {
        return new Promise((resolve, reject) => {
            mongoClient.collection('comments').remove({ _id: new ObjectId(id) }, (err) => {
                err ? reject(new Error(err)) : resolve('ok')
            })
        })
    }
    const updateComment = (comment) => {
        const { id, iduser, content } = comment
        return new Promise((resolve, reject) => {
            const myQuery = { _id: new ObjectId(id), createBy: new ObjectId(iduser) }
            const newValues = {
                $set: {
                    content: content
                }
            }
            mongoClient.collection('comments').updateOne(myQuery, newValues, (err, data) => {
                err ? reject(new Error(err)) : resolve(data)
            })
        })
    }
    return { deleteComment, getCommentByIdPost, getCommentById, addComment, updateComment }
}
