const inquirer = require('inquirer');
const figlet = require('figlet');
const db = require("./db/connections");
//const initialPrompt = require('./lib/initialPrompt')
const getDepartments = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM department", (err, results) => {
      if (err) {
        reject(err);
      } else {
        //console.log(results);
        resolve(results);
      }
    });
  });
  const deptsArr = data.map((element) => element.dep_name);
  console.log(deptsArr);
  return deptsArr;
};
const departments = async () => {
  const choicesArr = await getDepartments()
  inquirer
    .prompt([
      {
        type: "list",
        message: "What Department would you like to see?",
        name: "deptartments",
        choices: choicesArr,
      },
    ])
    .then((data) => {
      
      console.log(data);
    });
};

// Connect to MySQL and title
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log(`====================================================================================`);
  console.log(``);
  console.log((figlet.textSync('Employee Tracker')));
  console.log(``);
  console.log(``);
  console.log(`====================================================================================`);
  initialPrompt()
});

const initialPrompt  = async () => {
  await inquirer.prompt(initialPromptQuestions)
  .then((answers) => {
    console.log('Answer:', answers.initialPrompt);
    const answer = answers.initialPrompt;
    switch (answer) {
      case 'View All Emp(loyees':
        viewAllEmployees();
        break;
      case 'Add Employees':
        console.log('I chose add employees');
        break;
      case 'Update Employee Role':
        console.log('I chose Update Employee Role');
        break;
      case 'View All Roles':
        console.log('I chose View All Roles');
        break;
      case 'Add Role':
        console.log('I chose Add Role');
        break;
      case 'View All Departments':
        departments()
        break;
    }
  });
};

const initialPromptQuestions = [
  {
    type: 'list',
    name: 'initialPrompt',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'Add Employees', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments']
  },
]




// Query database
// db.query('SELECT * FROM employees', function (err, results) {
//   console.table(results);
// });

// View All Employees
// const viewAllEmployees = () => {
//   let sql =       `SELECT employees.id, 
//                   employees.first_name, 
//                   employees.last_name, 
//                   role.title, 
//                   department.department_name AS 'department', 
//                   role.salary
//                   FROM employees, role, department 
//                   WHERE department.id = role.department_id 
//                   AND role.id = employee.role_id
//                   ORDER BY employee.id ASC`;
//   connection.promise().query(sql, (error, response) => {
//     if (error) throw error;
//     console.table(response);
//   });
// };