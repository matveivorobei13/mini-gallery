require('dotenv').config();


console.log("1")
const { Pool } = require("pg")
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})


async function upload_controler(req, res){
    try{
        await pool.query(`INSERT INTO uploads(title, description, path)
        VALUES($1, $2, $3)`, [req.body.title, req.body.description, req.file.filename])
        res.json({status: "ok", message: "публикация добавлена"})
    }
    catch(e){
        console.error(e)
        res.json({status: "error", message: "ошибка базы данных"})
    }
   
}

async function get_posts_controler(req, res){
    try{
        const posts = await pool.query(`SELECT * FROM uploads`)
        res.json({status: "ok", posts: posts.rows})
    }
    catch(e){
        console.error(e)
        res.json({status: "error", message: "ошибка базы данных"})
    }
    

}

async function search_post_controler(req, res){
   
    try{
       

        const searched_posts = await pool.query(`
            SELECT * FROM uploads 
            WHERE title LIKE $1`, [`%${req.cleanSearch}%`])
        res.json({status: "ok", posts: searched_posts.rows})
    }
    catch(e){
        console.error(e)
        res.json({status: "error", message: "ошибка базы данных"})
    }
}

async function get_post_controler(req, res){
    const id = Number(req.params.id)
    console.log(id)
    if (Number.isNaN(id)) {
        return res.json({
            status: "error",
            message: "id должен быть числом"
        })
    }
    try{
        const post = await pool.query(`SELECT * FROM uploads
            WHERE id = $1`, [id])
        if (post.rows.length === 0) {
            return res.json({
            status: "error",
            message: "Пост не найден"
        })
}

        res.json({
            status: "ok",
            post: post.rows[0]
        })
    }
    catch(e){
        console.error(e)
        res.json({status: "error", message: "ошибка базы данных"})
    }
}
module.exports = {
    upload_controler,
    get_posts_controler,
    search_post_controler,
    get_post_controler
}