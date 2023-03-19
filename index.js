const inquirer = require('inquirer');




// initialize the application
const init = async () => {
  await inquirer.prompt(managerQuestionsPrompt)
    .then((answers) => {
      const teamManager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
      generatedTeamArray.push(teamManager)
      addTeamMemeber();
    })
};



init()