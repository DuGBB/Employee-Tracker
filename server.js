const db = require('./db/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


function Company() {

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
            this.departmentView();
        }
    })
   // db.end();
}

Company.prototype.departmentView = function () {
    const sql = `SELECT id, name FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        } else {
            console.table(rows);
        }
        // res.json({
        //     message: 'success',
        //     data: rows
        // });
    });
}

new Company().initializeCompany();