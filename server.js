const db = require('./db/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


function Company() {

}

function dbCall(sql) {
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        } else {
            console.table(rows);
        }
    });
}

Company.prototype.initializeCompany = function () {

    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Choose between the following options:',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']

        }
    ]).then(({ menu }) => {
        if (menu === 'View All Departments') {
            this.departmentsView();
        }
        if (menu === 'View All Roles') {
            this.partsView();
        }
        if (menu === 'View All Employees') {
            this.employeesView();
        }
    })
    // db.end();
}

Company.prototype.departmentsView = function () {
    const sql = `SELECT id, name FROM departments`;

    dbCall(sql);
}

Company.prototype.partsView = function () {
    const sql = `SELECT a.id, a.title, a.salary, b.name
                 FROM parts a INNER JOIN departments b
                 ON a.department_id = b.id`;

    dbCall(sql);
}

Company.prototype.employeesView = function () {
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

                dbCall(sql);
}

new Company().initializeCompany();