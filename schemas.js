const { z } = require("zod")

const upload_schema = z.object({
    title: z.string()
        .min(3, {message: "заголовок должен быть не меньше 3 символов"})
        .max(30, {message: "заголовок должен быть не меньше 3 символов"}),
    description: z.string()
        .min(5, {message: "заголовок должен быть не меньше 5 символов"})
        .max(500, {message: "заголовок должен быть не меньше 500 символов"})
})

module.exports = {
    upload_schema
}