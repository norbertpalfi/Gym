
const mysql = require('mysql');

const connection = mysql.createConnection({
  database: 'Divercity',
  host: 'localhost',
  port: 3306,
  user: 'User',
  password: 'Password',
  multipleStatements: true,
});

module.exports = (query, options = []) => new Promise((resolve, reject) => {
  connection.query(query, options, (error, result) => {
    if (error) {
      reject(new Error(`Error while running '${query}:${error}'`));
    }
    resolve(result);
  });
});
