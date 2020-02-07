const joi = require('joi')
const comment = require('./comment.model')(joi)
const schemas = { comment }
const schemaValidator = (object, type) => {
    return new Promise((resolve, reject) => {
        if (!object) {
            reject(new Error('object to validate not provided'))
        }
        if (!type) {
            reject(new Error('schema type to validate not provided'))
        }
        const { error, value } = joi.validate(object, schemas[type])
        if (error) {
            reject(new Error(`invalid ${type} data, err: ${error}`))
        }
        resolve(value)
    })
}
module.exports = { schemas, schemaValidator }
