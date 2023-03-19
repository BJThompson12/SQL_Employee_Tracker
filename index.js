const inquirer = require('inquirer');
const express = require('express')
const mysql2 = require('mysql2');
const PORT = process.env.PORT || 3001;
//const db = require("./db/connections");
const initialPrompt = require('./lib/initialPrompt')
const app = express();

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
// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected");
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}🚀`);
});

// // initialize the application
// const init = async () => {
//   await inquirer.prompt(initialPrompt)
//     .then((answers) => {
//       console.log('Answer:', answers.initialPrompt)
//     })
// };



// init()