const mysql2 = require('mysql2');

// Connect to database
const db = mysql2.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password1906',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);


// export the database
module.exports = db; 