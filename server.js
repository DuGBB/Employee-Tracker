const db = require("./db/connection");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const { existsSync } = require("fs");
const { exit, listenerCount } = require("process");
const { CLIENT_RENEG_WINDOW } = require("tls");
const { resolve } = require("path/posix");

function Company() {}

Company.prototype.dbCall = async function (sql, showTable) {
  return await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      if (showTable) {
        console.log("\n");
        console.table(rows);
        console.log("\n\n");
        for (let i = 0; i < rows.length; i++) {
          //   console.log(rows[i]);
        }
        this.initializeCompany();
      } else {
        let valArray = [];
        for (let i = 0; i < rows.length; i++) {
          valArray.push(rows[i].name);
        }
        return valArray;
      }
    })
    .catch(() => {
      console.log("got an error in dbCall");
    });
};

Company.prototype.initializeCompany = async function () {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "Choose between the following options:",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])
    .then(({ menu }) => {
      if (menu === "View All Departments") {
        this.departmentsView();
      }
      if (menu === "View All Roles") {
        this.partsView();
      }
      if (menu === "View All Employees") {
        this.employeesView();
      }
      if (menu === "Add a Department") {
        this.newDepartment();
      }
      if (menu === "Add a Role") {
        this.newRole();
      }
      if (menu === "Add an Employee") {
        this.newEmployee();
      }
      if (menu === "Update an Employee Role") {
        this.updateEmployee();
      }
      if (menu === "Quit") {
        db.end();
        exit(0);
      }
    });
};

Company.prototype.departmentsView = async function () {
  const sql = `SELECT id, name FROM departments`;

  await this.dbCall(sql, true);
};

Company.prototype.partsView = async function () {
  const sql = `SELECT a.id, a.title, a.salary, b.name
                 FROM parts a INNER JOIN departments b
                 ON a.department_id = b.id`;

  await this.dbCall(sql, true);
};

Company.prototype.employeesView = async function () {
  const sql = `SELECT a.id, a.first_name, a.last_name,
                b.title, c.name, b.salary, d.first_name as manager_first_name, 
                d.last_name as manager_last_name 
                FROM employees a
                INNER JOIN parts b
                ON a.part_id = b.id
                INNER JOIN departments c
                ON b.department_id = c.id
                INNER JOIN employees d
                ON a.manager_id = d.id`;

  await this.dbCall(sql, true);
};

Company.prototype.newEmployee = async function () {
  let titleTracker = new Promise((resolve, reject) => {
    let title = this.getEmployeeNames();
    resolve(title);
  });
  let roleTracker = new Promise((resolve, reject) => {
    // console.log(resultChoices);
    let roles = this.getRoles();
    resolve(roles);
  });
  Promise.all([titleTracker, roleTracker]).then((values) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Please enter first name.",
        },
        {
          type: "input",
          name: "last_name",
          message: "Please enter last name.",
        },
        {
          type: "list",
          name: "role",
          message: "Please choose the employees new role.",
          choices: values[1],
        },
        {
          type: "list",
          name: "manager",
          message: "Please select the employees manager.",
          choices: values[0],
        },
      ])
      .then(({ first_name, last_name, role, manager }) => {
        const sql = `INSERT INTO employees (first_name, last_name, part_id, manager_id)
                        VALUES ('${first_name}', '${last_name}',(SELECT id FROM parts WHERE title = '${role}'),(SELECT id FROM (SELECT id FROM employees WHERE last_name = '${manager}')sub))`;

        this.dbCall(sql, false);
        this.employeesView();
      });
  });
};

Company.prototype.updateEmployee = async function () {
  let employeeSelector = new Promise((resolve, reject) => {
    let lastName = this.getEmployeeNames();
    resolve(lastName);
  });
  let roleSelector = new Promise((resolve, reject) => {
    let roles = this.getRoles();
    resolve(roles);
  });
  Promise.all([employeeSelector, roleSelector]).then((values) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "last_name",
          message: "Please select last name.",
          choices: values[0],
        },
        {
          type: "list",
          name: "role",
          message: "Please select the employees new role.",
          choices: values[1],
        },
      ])
      .then(({ last_name, role }) => {
        const sql = `UPDATE employees SET part_id = (SELECT id FROM parts WHERE title = '${role}') WHERE last_name = '${last_name}'`;

        this.dbCall(sql, false);
        this.employeesView();
      });
  });
};

Company.prototype.getEmployeeNames = async function () {
  const sql = `SELECT last_name AS name FROM employees`;
  let manager = await this.dbCall(sql, false);
  return manager;
};

Company.prototype.newDepartment = async function () {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter a new department name",
      },
      {
        type: "input",
        name: "description",
        message: "Enter the new departments description",
      },
    ])
    .then(({ name, description }) => {
      const sql = `INSERT INTO departments (name, description)
                    VALUES ('${name}', '${description}')`;

      this.dbCall(sql, false);
      console.log("Added department");
      this.departmentsView();
    });
};

Company.prototype.newRole = async function () {
  let titleTracker = new Promise((resolve, reject) => {
    let title = this.getDepartmentNames();
    resolve(title);
  }).then((result_choices) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "Enter a new role",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the new salary",
        },
        {
          type: "list",
          name: "department",
          message: "Please select department",
          choices: result_choices,
        },
      ])
      .then(({ name, salary, department }) => {
        const sql = `INSERT INTO parts (title, salary, department_id)
                      VALUES ('${name}', '${salary}',(SELECT id FROM departments WHERE name = '${department}'))`;

        this.dbCall(sql, false);
        this.partsView();
      });
  });
};

Company.prototype.getRoles = async function () {
  const sql = `SELECT title AS name FROM parts`;
  let roles = await this.dbCall(sql, false);
  return roles;
};

Company.prototype.getDepartmentNames = async function () {
  const sql = `SELECT name FROM departments`;
  let depts = await this.dbCall(sql, false);
  return depts;
};

new Company().initializeCompany();
