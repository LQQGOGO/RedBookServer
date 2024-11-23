const joi = require('joi')

const validate = schema => {
  return async (ctx, next) => {
    const data = ctx.request.body
    console.log('Received Body:', ctx.request.body)
    const { error } = joi
      .object(schema.body)
      .validate(data, { abortEarly: false })

    if (error) {
      ctx.status = 400 // Bad Request
      ctx.body = {
        message: 'Validation Error',
        details: error.details.map(err => err.message) // 错误详情
      }
      return
    }

    await next()
  }
}

module.exports = validate
