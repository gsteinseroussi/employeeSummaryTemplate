const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { run } = require("jest");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const employeeList = [];
const employeeData = [];

function promptUser() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the employee's name?",
      },
      {
        type: "input",
        name: "id",
        message: "What is your id number?",
      },
      {
        type: "input",
        name: "email",
        message: "What is your email address?",
      },
      {
        type: "rawlist",
        name: "role",
        message: "Which of the following describes your role?",
        choices: ["Intern", "Engineer", "Manager"],
      },
    ])
    .then(function (data) {
      employeeData.push(data.name, data.id, data.email);

      if (data.role === "Intern") {
        promptIntern();
      } else if (data.role === "Manager") {
        promptManager();
      } else if (data.role === "Engineer") {
        promptEngineer();
      }
    });
}

function promptIntern() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "school",
        message: "What school do you attend?",
      },
    ])
    .then(function (res) {
      employeeList.push(
        new Intern(
          employeeData[0],
          employeeData[1],
          employeeData[2],
          res.school
        )
      );
      employeeData.length = 0;
      console.log(employeeList);
    })
    .then(function () {
      runAgain();
    });
}

function promptManager() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "officeNumber",
        message: "What is your office number?",
      },
    ])
    .then(function (res) {
      employeeList.push(
        new Manager(
          employeeData[0],
          employeeData[1],
          employeeData[2],
          res.officeNumber
        )
      );
      employeeData.length = 0;
      console.log(employeeList);
    })
    .then(function () {
      runAgain();
    });
}

function promptEngineer() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "github",
        message: "What is your github url?",
      },
    ])
    .then(function (res) {
      employeeList.push(
        new Engineer(
          employeeData[0],
          employeeData[1],
          employeeData[2],
          res.github
        )
      );
      employeeData.length = 0;
    })
    .then(function () {
      runAgain();
    });
}

promptUser();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
function runAgain() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "repeat",
        message: "Have you completed your employee list?",
        choices: ["Yes", "No"],
      },
    ])
    .then(function (res) {
      if (res.repeat === "Yes") {
        const html = render(employeeList);
        writeHtml(html);
      } else {
        promptUser();
      }
    });
}
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

function writeHtml(text) {
  return fs.writeFile(outputPath, text, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Success!");
    }
  });
}

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
