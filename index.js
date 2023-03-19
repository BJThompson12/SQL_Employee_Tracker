const inquirer = require('inquirer');
const figlet = require('figlet');
const cTable = require('console.table')
const db = require("./db/connections");
const { query } = require('./db/connections');
//const initialPrompt = require('./lib/initialPrompt')

let currrentDepartments = []

const getDepartments = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM department", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
currrentDepartments += data
  console.log('');
  console.log('\x1b[33m ALL DEPARTMENTS \x1b[0m');
  console.log('');
  console.table((currrentDepartments));
  initialPrompt()
};

const viewAllEmployees = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM employees", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
  console.log('')
  console.table(data)
  initialPrompt()
};

const getRoles = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM roles", (err, results) => {
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
  console.table((data));
  initialPrompt()
};

const addRole = async () => {
  await inquirer.prompt([
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
        choices: ['Sales', 'Engineering', 'Finance', 'Legal']
      }
    ])
    .then((answers) => {
      const title = answers.roleTitle;
      const salary = answers.roleSalary;
      const department = answers.roleDepartment;
    
      console.log(title, salary, department);
      let sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', ${salary}, 2)`;
      db.query(sql, function (err, results) {
        if (err) {
          console.log(err);
        } else {
         // resolve(results);
          console.log(results);
          console.log('');
          console.log('\x1b[33m ROLE ADDED \x1b[0m');
          console.log('');
          getRoles()
          initialPrompt()
        }
      });
    });
  }

  const addDepartment = async () => {
    await inquirer .prompt([
      {
        type: "input",
        message: "What Department Do You Want To Add?",
        name: "depts",
      },
    ])
    .then((data) => handleAddDept(data));
  }
  const handleAddDept = async (val) => {
    const { depts } = val;
    const query = `INSERT INTO department (id, name) VALUES (100, "${depts}")`
    const data = await new Promise((resolve, reject) => {
      db.query(
        query,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    console.table([data]);
    initialPrompt();
  };


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
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employees':
        console.log('I chose add employees');
        break;
      case 'Update Employee Role':
        console.log('placeholder');
        break;
      case 'View All Roles':
        getRoles()
        break;
      case 'Add Role':
        addRole()
        break;
      case 'View All Departments':
        getDepartments()
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

