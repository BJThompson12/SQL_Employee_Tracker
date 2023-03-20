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
    db.query(`SELECT id, dep_name AS 'name' FROM department`, (err, results) => {
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
  const viewEmployeesQuery = `SELECT 
  employees.id, 
  employees.first_name, 
  employees.last_name, 
  roles.title, 
  department.dep_name AS 'department', 
  roles.salary,
  CONCAT(manager.first_name, ' ', manager.last_name) AS 'manager'
FROM 
  employees
  JOIN roles ON employees.role_id = roles.id
  JOIN department ON roles.department_id = department.id
  LEFT JOIN employees AS manager ON employees.manager_id = manager.id
ORDER BY 
  employees.id ASC;`
  const data = await new Promise((resolve, reject) => {
    db.query(viewEmployeesQuery, (err, results) => {
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

const viewAllRoles = async () => {
  const viewRolesQuery = `SELECT roles.id, roles.title, department.dep_name AS department, salary
  FROM roles
  INNER JOIN department ON roles.department_id = department.id
  ORDER BY roles.id ASC`
  const data = await new Promise((resolve, reject) => {
    db.query(viewRolesQuery, (err, results) => {
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
          let insertRole = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', ${salary}, 2)`;
          db.query(insertRole, function (err, results) {
            if (err) {
              console.log(err);
            } else {
              console.log('');
              console.log('\x1b[33m ROLE ADDED \x1b[0m');
              console.log('');
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
          initialPrompt();
        }
      });
    });
};

const addEmployee = () => {
  db.query(`SELECT id, title FROM roles ORDER BY id ASC`, async function (err, results) {
    if (err) {
      console.log(err);
    } else {
      //console.log(results);
      // map the results to a key : value pair for inquirer
      let roleQueryArray = results.map(obj => {
        return {"value": obj.id, "name": obj.title}
      })
      const queryEmployees = `SELECT id, first_name, last_name FROM employees ORDER BY id ASC;`;
      db.query(queryEmployees, async function (err, results) {
        if (err) {
          console.log(err);
        } else {
          let employeeQueryArray = results.map(obj => {
            return {'value': obj.id, 'name': obj.first_name +' '+ obj.last_name}
          })
          employeeQueryArray.push({'value': 'NULL', 'name': 'None'})
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
                choices: roleQueryArray,
              },
              {
                type: 'list',
                name: 'manager',
                message: 'Who is the employees Manager',
                choices: employeeQueryArray, 
              },
            ])
            .then((answers) => {
              const first = answers.firstName;
              const last = answers.lastName;
              const role = answers.employeeRole;
              const manager = answers.manager;
              //console.log(first, last, role, manager);
              const addEmployeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
              VALUES ('${first}', '${last}', ${role}, ${manager})`
              db.query(addEmployeeQuery, async function (err, results) {
                if (err) {
                  console.log(err);
                }})
              console.log('');
              console.log('\x1b[33m EMPLOYEE ADDED \x1b[0m');
              console.log('');
              initialPrompt();
            });
        }
      });
    }
  });
};

// Connect to MySQL and title
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log(
    `==========================================================================`
  );
  console.log(``);
  console.log(figlet.textSync('             Employee'));
  console.log(figlet.textSync('             Manager'));
  console.log(``);
  console.log(``);
  console.log(
    `==========================================================================`
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
        viewAllRoles();
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
