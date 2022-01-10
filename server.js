const db = require('./db/connection');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { existsSync } = require('fs');
const { exit } = require('process');


function Company() {

}

async function dbCall(sql, showTable) {
    await db.promise().query(sql)
    .then(([rows,fields]) =>{
        if (showTable) {
            console.log('\n');
            console.table(rows);
        }
    }).catch(console.log)
    .then( () => console.log('\nquery completed\n'));
}

Company.prototype.initializeCompany = async function () {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'Choose between the following options:',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']

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
            if (menu === 'Add a Department') {
               this.newDepartment();
            }
            if (menu === 'Quit') {
                // db.end();
                // exit(0);
                console.log("do nothing");
            }
        }).then(() => {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'again',
                    message: 'Continue?',
                    default: true
                }
            ]).then(( {again}) => {
                if (again) {
                    this.initializeCompany();
                }else {
                    db.end();
                    exit(0);
                }
            });
        })
}

Company.prototype.departmentsView = async function () {
    const sql = `SELECT id, name FROM departments`;

    await dbCall(sql, true);
}

Company.prototype.partsView = async function () {
    const sql = `SELECT a.id, a.title, a.salary, b.name
                 FROM parts a INNER JOIN departments b
                 ON a.department_id = b.id`;

    await dbCall(sql, true);
}

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

    await dbCall(sql, true);
}

Company.prototype.newDepartment = async function () {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter a new department name'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter the new departments description'
        }
    ]).then(({ name, description }) => {
        const sql = `INSERT INTO departments (name, description)
                    VALUES ('${name}', '${description}')`;

        dbCall(sql, false);
        console.log('Added department');
    })
}

new Company().initializeCompany();