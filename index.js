const inquirer = require('inquirer');
const figlet = require('figlet');
const colors = require('colors/safe');
const cTable = require('console.table');
const db = require('./db/connections');
const { query } = require('./db/connections');
//const initialPrompt = require('./lib/initialPrompt')

//let departmentArray = [];
//let roleArray = [];
//let employeeArray = [];

const viewAllDepartments = async () => {
  const data = await new Promise((resolve, reject) => {
    db.query(
      `SELECT id, dep_name AS 'name' FROM department`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
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
  employees.id ASC;`;
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
  ORDER BY roles.id ASC`;
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
  console.log('\x1b[34m ALL ROLES \x1b[0m');
  console.log('');
  console.table(data);
  initialPrompt();
};

// IF a user selects add a role from the inquirer THEN run this function
const addRole = () => {
  /*run this query to get the current departments. We are doing this bc we want to keep the list dynamic.
  To add a role, you have to add it to a department. Thats in our schema and how the database tables are set up.
  IF they have added more departments, we want to make sure that ALL of them departments are displayed so we are running this query */
  db.query(
    `SELECT id, dep_name FROM department`,
    async function (err, results) {
      if (err) {
      } else {
        /*Here i am take thew results of the query and we need to put it in the right format for inqiurer. 
      We want to DISPLAY the name(string) of the department but we want to STORE the ID(number) of it because to put it in the database
      it HAS to be a number NOT a string. 
      So we map the results to be in this format {value: <id>, name: '<department name> 
      In that format inquirer will DISPLAY the name for them to choose BUT we STORE the ID */
        let departmentArray = results.map((obj) => {
          return { value: obj.id, name: obj.dep_name };
        });
        // ask the user the questions for details on te role
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
            // store the answers in a variable using dot notation
            const title = answers.roleTitle;
            const salary = answers.roleSalary;
            const department = answers.roleDepartment;
            // log out your answers to make sure they are correct
            console.log(title, salary, department);
            /* Now you need to take the answers and RUN the query to ADD them to your database. 
          You put the stored answer variables IN the query as a Temp literal. 
          I store the query in a variable to make it a little more clean*/
            let insertRole = `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', ${salary}, ${department})`;
            // this is where you run the query
            db.query(insertRole, function (err, results) {
              if (err) {
                console.log(err);
              } else {
                // this is just me showign on the screen HEY your role has been addedd successfully
                console.log('');
                console.log('\x1b[33m ROLE ADDED \x1b[0m');
                console.log('');
                // start your prompt over to let them choose what they want to do next
                initialPrompt();
              }
            });
          });
      }
    }
  );
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
  db.query(
    `SELECT id, title FROM roles ORDER BY id ASC`,
    async function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
        // map the results to a key : value pair for inquirer
        let roleQueryArray = results.map((obj) => {
          return { value: obj.id, name: obj.title };
        });
        const queryEmployees = `SELECT id, first_name, last_name FROM employees ORDER BY id ASC;`;
        db.query(queryEmployees, async function (err, results) {
          if (err) {
            console.log(err);
          } else {
            console.log(results);
            let employeeQueryArray = results.map((obj) => {
              return {
                value: obj.id,
                name: obj.first_name + ' ' + obj.last_name,
              };
            });
            console.log(employeeQueryArray);
            employeeQueryArray.push({ value: 'NULL', name: 'None' });
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
                console.log(first, last, role, manager);
                const addEmployeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
              VALUES ('${first}', '${last}', ${role}, ${manager})`;
                db.query(addEmployeeQuery, async function (err, results) {
                  if (err) {
                    console.log(err);
                  }
                });
                console.log('');
                console.log('\x1b[31m EMPLOYEE ADDED \x1b[0m');
                console.log('');
                initialPrompt();
              });
          }
        });
      }
    }
  );
};

const updateEmployeeRole = () => {
  db.query(
    'SELECT id, employees.first_name, employees.last_name FROM employees',
    async function (err, results) {
      if (err) {
        console.log(err);
      } else {
        let employeeQueryArray = results.map((obj) => {
          return {
            value: obj.id,
            name: obj.first_name + ' ' + obj.last_name,
          };
        });
        // run query to get all roles to be selected
        db.query('SELECT id, title FROM roles', async (err, results) => {
          if (err) {
            console.log(err);
          } else {
            // map array to be in value: <id>, name: <title> format
            let roleQueryArray = results.map((obj) => {
              return {
                value: obj.id,
                name: obj.title,
              };
            });
            await inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'employeeName',
                  message: `Which employee's role would  you like to update?`,
                  choices: employeeQueryArray,
                },
                {
                  type: 'list',
                  name: 'roleName',
                  message:
                    'Which role do you want to assign the selected employee?',
                  choices: roleQueryArray,
                },
              ])
              .then((answers) => {
                const id = answers.employeeName;
                const roleId = answers.roleName;
                console.log(id, roleId);
                db.query(
                  `UPDATE employees SET role_id = ${roleId} WHERE id = ${id}`,
                  (err, results) => {
                    if (err) {
                      console.log(err);
                    }
                    console.log('');
                    console.log('\x1b[31m EMPLOYEE UPDATED \x1b[0m');
                    console.log('');
                    initialPrompt();
                  }
                );
              });
          }
        });
      }
    }
  );
};

// Connect to MySQL and title
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log(colors.trap(
    `==========================================================================`
  ));
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
        updateEmployeeRole();
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
