const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config(); 

const db = mysql2.createConnection(
    {
        host: process.env.HOST_NAME, 
        user: 'root',
        password: 'password1906', 
        database: 'employee_db'
    },
    console.log(`connected to employee_cms db`)
)
// export the database
module.exports = db; 