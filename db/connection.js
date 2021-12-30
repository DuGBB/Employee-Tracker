const mysql = require('mysql2');
const fs = require('fs');
// const Connection = require('mysql2/typings/mysql/lib/Connection');

// const dbsetup = fs.readFileSync('db/db.sql', {
//     encoding: 'utf-8'
// });

// const dbschema = fs.readFileSync('db/schema.sql', {
//     encoding: 'utf-8'
// });

// const dbseeds = fs.readFileSync('db/seeds.sql', {
//     encoding: 'utf-8'
// });

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'consortium'
    });

    connection.connect((err) => {
        if (err) {
            console.log('Not connected to the database');
            throw err;
        } else {
            console.log('Connected to database');
        }
    });


    
    global.db = connection;

    // db.query(dbsetup, err => {
    //     if (err) {
    //         console.log('Could not create and use new consortium database');
    //         throw err
    //     } else {
    //         console.log('Consortium database created and in use.');
    //     }
    // });

    // db.query(dbschema, err => {
    //     if (err) {
    //         console.log('Could not create schema');
    //         throw err
    //     } else {
    //         console.log('Schema created');
    //     }
    // });

    // db.query(dbseeds, err => {
    //     if (err) {
    //         console.log('Could not populate table');
    //         throw err
    //     } else {
    //         console.log('Table populated');
    //     }
    // });

    module.exports = db;