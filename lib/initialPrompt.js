const inquirer = require('inquirer');
const colors = require('colors/safe');
const figlet = require('figlet');

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
      case 'Exit':
        showThankYou();
        break;
    }
  });
};

// questions Array for prompt
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
      'Exit',
    ],
  },
];

// Exit the inquirere prompt
function showThankYou() {
  console.log(``);
  console.log(
    colors.cyan(
      `=====================================================================================`
    )
  );
  console.log(``);
  console.log(colors.cyan(figlet.textSync('See You Next Time!')));
  // console.log(colors.cyan(figlet.textSync('                Manager')));
  console.log(``);
  console.log(``);
  console.log(
    colors.cyan(
      `=====================================================================================`
    )
  );
  process.exit(0)
}

module.exports = initialPrompt