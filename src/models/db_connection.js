const mysql = require('mysql2')

// const db = mysql.createConnection(process.env.DATABASE_URL)

const db = mysql.createConnection({
    host:       process.env.DATABASE_HOST,
    user:       process.env.DATABASE_USER,
    password:   process.env.DATABASE_PASSWORD,
    database:   process.env.DATABASE_NAME 
})

db.connect((err) => {
    if (err) {
        console.log('Error connection to MySQL database') 
        return 
    }
    console.log('MySQL successfully connected')
})

module.exports = db
