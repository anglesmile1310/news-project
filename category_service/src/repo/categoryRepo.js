module.exports = function (mongoClient, options) {
  const { ObjectId } = options

  const createIndex = () => {
    mongoClient.createCollection('categories', (error) => {
      if (error) {
        return console.error(error)
      }
      mongoClient.collection('categories').createIndex('displayName', { unique: true })
    })
  }

  createIndex()
  const addCategory = (category) => {
    return new Promise((resolve, reject) => {
      category.createBy = new ObjectId(category.createBy)
      mongoClient.collection('categories').insertOne(category, (err, data) => {
        if (err) reject(new Error(err))
        else {
          const { result } = data
          if (result.ok) {
            resolve(data)
          } else {
            reject(new Error('Không thể thêm category.'))
          }
        }
      })
    })
  }
  const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').findOne({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('categories').remove({ _id: new ObjectId(id) }, (err) => {
        err ? reject(new Error(err)) : resolve('ok')
      })
    })
  }
  const updateCategory = (category) => {
    const { id, iduser, displayName } = category
    return new Promise((resolve, reject) => {
      const myQuery = { _id: new ObjectId(id), createBy: new ObjectId(iduser) }
      const newValues = {
        $set: {
          displayName: displayName
        }
      }
      mongoClient.collection('categories').updateOne(myQuery, newValues, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  return { deleteCategory, getCategoryById, addCategory, updateCategory }
}
