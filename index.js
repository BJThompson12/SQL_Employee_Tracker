const inquirer = require('inquirer');
const figlet = require('figlet');
const cTable = require('console.table');
const db = require('./db/connections');
const { query } = require('./db/connections');
//const initialPrompt = require('./lib/initialPrompt')

//let departmentArray = [];
//let roleArray = [];
//let employeeArray = [];

const viewAllDepartments = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM department', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  console.log('');
  console.log('\x1b[33m ALL DEPARTMENTS \x1b[0m');
  console.log('');
  console.table(data);
  initialPrompt();
};

const viewAllEmployees = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  console.log('');
  console.table(data);
  initialPrompt();
};

const getRoles = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM roles', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  console.log('');
  console.log('\x1b[33m ALL ROLES \x1b[0m');
  console.log('');
  console.table(data);
  initialPrompt();
};

const addRole = () => {
  db.query(`SELECT dep_name FROM department`, async function (err, results) {
    if (err) {
      console.log(err);
    } else {
     let departmentArray = []
      results.forEach((obj) => {
        // remove the title from the object
        departmentArray.push(obj['dep_name']);
      });
      //console.log(departmentArray);
      await inquirer
        .prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: 'What Role would you like to add?',
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the Role?',
          },
          {
            type: 'list',
            name: 'roleDepartment',
            message: 'What is the Department for the Role?',
            choices: departmentArray,
          },
        ])
        .then((answers) => {
          const title = answers.roleTitle;
          const salary = answers.roleSalary;
          const department = answers.roleDepartment;
         // console.log(title, salary, department);
          let sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', ${salary}, 2)`;
          db.query(sql, function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log(results);
              console.log('');
              console.log('\x1b[33m ROLE ADDED \x1b[0m');
              console.log('');
              getRoles();
              initialPrompt();
            }
          });
        });
    }
  });
};

const addDepartment = async () => {
  await inquirer
    .prompt([
      {
        type: 'input',
        message: 'What Department Do You Want To Add?',
        name: 'depts',
      },
    ])
    .then((answers) => {
      const department = answers.depts;
      const sql = `INSERT INTO department (dep_name) VALUES ('${department}')`;
      db.query(sql, function (err, results) {
        if (err) {
          console.log(err);
        } else {
          // resolve(results);
          console.log('');
          console.log('\x1b[33m DEPARTMENT ADDED \x1b[0m');
          console.log('');
          viewAllDepartments();
          initialPrompt();
        }
      });
    });
};

const addEmployee = () => {
  db.query(`SELECT title FROM roles`, async function (err, results) {
    if (err) {
      console.log(err);
    } else {
      let roleArray = []
      results.forEach((obj) => {
        // remove the title from the object
        roleArray.push(obj['title']);
      });
      console.log(roleArray);
      const queryEmployees = `SELECT employees.first_name, employees.last_name FROM employees`;
      db.query(queryEmployees, async function (err, results) {
        if (err) {
          console.log(err);
        } else {
          let employeeArray = []
          //console.log(`Here are the results`);
          //console.log(results);
          const newArray = results.map(({ first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
          }));
          console.log(newArray);
          newArray.forEach((obj) => {
            employeeArray.push(obj['name']);
          });
          console.log(employeeArray);
          await inquirer
            .prompt([
              {
                type: 'input',
                name: 'firstName',
                message: 'What is the employees First Name?',
              },
              {
                type: 'input',
                name: 'lastName',
                message: 'What is the employees Last Name?',
              },
              {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the employees role?',
                choices: roleArray,
              },
              {
                type: 'list',
                name: 'manager',
                message: 'Who is the employees Manager',
                choices: employeeArray,
              },
            ])
            .then((answers) => {
              const first = answers.firstName;
              const last = answers.lastName;
              const role = answers.employeeRole;
              const manager = answers.manager;
              console.log(first, last, role, manager);
              // add the employee
            });
        }
      });
    }
  });
};

const generateEmployeeArray = () => {};

// console.log(title, salary, department);
// let sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', ${salary}, 2)`;
// db.query(sql, function (err, results) {
//   if (err) {
//     console.log(err);
//   } else {
//     // resolve(results);
//     console.log(results);
//     console.log('');
//     console.log('\x1b[33m ROLE ADDED \x1b[0m');
//     console.log('');
//     getRoles()
//     initialPrompt()
//   }
// });

// const answer = answers.initialPrompt;
// switch (answer) {
//   case 'View All Employees':
//     viewAllEmployees();
//     break;
//   case 'Add Employees':
//     console.log('I chose add employees');
//     break;
//   case 'Update Employee Role':
//     console.log('placeholder');
//     break;
//   case 'View All Roles':
//     getRoles();
//     break;
//   case 'Add Role':
//     console.log('I chose Add Role');
//     break;
//   case 'View All Departments':
//     getDepartments();
//     break;
// }

/*
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
*/

// Connect to MySQL and title
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log(
    `====================================================================================`
  );
  console.log(``);
  console.log(figlet.textSync('Employee Tracker'));
  console.log(``);
  console.log(``);
  console.log(
    `====================================================================================`
  );
  initialPrompt();
});

const initialPrompt = async () => {
  await inquirer.prompt(initialPromptQuestions).then((answers) => {
    const answer = answers.initialPrompt;
    switch (answer) {
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        getRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        console.log('placeholder');
        break;
    }
  });
};

const initialPromptQuestions = [
  {
    type: 'list',
    name: 'initialPrompt',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add an Employee',
      'Update Employee Role',
    ],
  },
];
