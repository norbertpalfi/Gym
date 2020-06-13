const mysql = require('mysql'),
  queryParametrized = require('./config');


const connection = mysql.createConnection({
  database: 'Divercity',
  host: 'localhost',
  port: 3306,
  user: 'User',
  password: 'Password',
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error(`Connection error: ${err.message}`);
    process.exit(1);
  }

  connection.query('USE Divercity', (createErr) => {
    if (createErr) {
      console.error(`SQL: ${createErr.message}`);
      process.exit(1);
    }
  });
});

exports.getHalls = (callback) => {
  const query = 'SELECT * FROM Halls';
  connection.query(query, callback);
};

exports.hallExists = (type) => queryParametrized('SELECT COUNT(*) AS count FROM Halls WHERE TYPE like ?', [type])
  .then((result) => (result[0].count > 0));

exports.getHallsLike = (type) => queryParametrized('SELECT * FROM Halls WHERE TYPE like ?', [type])
  .then((result) => result);

exports.hallExistsID = (id) => queryParametrized('SELECT COUNT(*) AS count FROM Halls WHERE H_ID = ?', [id])
  .then((result) => (result[0].count > 0));

exports.getHallID = (id) => queryParametrized('SELECT * FROM Halls WHERE H_ID = ?', [id])
  .then((result) => result);

exports.deleteHallID = (id) => queryParametrized('DELETE FROM Halls WHERE H_ID = ?', [id])
  .then((result) => result);

exports.insertHallsWithAmount = (type, pph, amount) => queryParametrized('INSERT INTO Halls(Type,PPH,Amount) VALUES (?,?,?)', [type, pph, amount])
  .then((result) => result);

exports.insertHallsWithoutAmount = (type, pph) => queryParametrized('INSERT INTO Halls(Type,PPH) VALUES (?,?)', [type, pph])
  .then((result) => result);

exports.modifyHallsWithAmount = (type, pph, amount, id) => queryParametrized('UPDATE Halls SET type = ?, pph = ?, amount = ? WHERE H_ID = ?;', [type, pph, amount, id])
  .then((result) => result);

exports.modifyHallsWithoutAmount = (type, pph, id) => queryParametrized('UPDATE Halls SET type = ?, pph = ?  WHERE H_ID = ?;', [type, pph, id])
  .then((result) => result);

exports.getTimetable = (email, callback) => {
  const query = `SELECT * FROM Halls WHERE Type LIKE 'Hall'; SELECT * from Students WHERE  Email like '${email}'`;
  connection.query(query, callback);
};

exports.getTimetableID = (req, callback) => {
  const query = `SELECT TimeOfRes,S_ID FROM Reservations WHERE H_ID = ${req.params.id}`;
  connection.query(query, callback);
};

exports.insertObject = (req, callback) => {
  const query = `INSERT INTO Halls(PPH, Amount, Type) VALUES ("${req.body.price}", "${req.body.amount}", "Object");`;
  connection.query(query, callback);
};

exports.insertRoom = (req, callback) => {
  const query = `INSERT INTO Halls(PPH, Type) VALUES ("${req.body.price}", "Hall");`;
  connection.query(query, callback);
};

exports.getPhotoOf = (req, callback) => {
  const query = `SELECT h.*, p.NamePath FROM Halls AS h LEFT JOIN Pictures AS p on h.H_ID = p.H_ID WHERE h.H_ID = ${req.params.id}`;
  connection.query(query, callback);
};

exports.fillSelects = (callback) => {
  const query = 'SELECT * FROM Halls WHERE Type LIKE \'Hall\'; SELECT * from Students';
  connection.query(query, callback);
};

exports.sameRoom = (req, callback) => {
  const query = `SELECT * FROM Reservations WHERE H_ID = ${req.body.roomID};`;
  connection.query(query, callback);
};

exports.insertReservation = (req, dateParser, callback) => {
  const query = `SELECT * FROM Halls WHERE Type LIKE 'Hall'; SELECT * from Students; DELETE FROM Reservations WHERE S_ID = ${req.body.name} AND H_ID = ${req.body.roomID} AND TimeOfRes like '${`${dateParser[0]} ${dateParser[1]}`}'; INSERT INTO Reservations( S_ID, H_ID, TimeOfRes ) VALUES ("${req.body.name}", "${req.body.roomID}", "${`${dateParser[0]} ${dateParser[1]}`}")`;
  connection.query(query, callback);
};

exports.deletePhotoOf = (ID, callback) => {
  const query = `DELETE FROM Pictures WHERE H_ID = ${ID};`;
  connection.query(query, callback);
};

exports.addPhotoOf = (ID, fileHandler, filename, callback) => {
  const query = `INSERT INTO Pictures (H_ID,NamePath,OriginalName) VALUES ("${ID}","${filename}","${fileHandler.name}")`;
  connection.query(query, callback);
};

exports.insertNewUser = (Name, Email, Password, AuthLevel, callback) => {
  const query = `INSERT INTO Students (StudentName,Email,AuthLevel,UserPass) VALUES ("${Name}","${Email}","${AuthLevel}","${Password}");`;
  connection.query(query, callback);
};

exports.checkEmail = (Email, callback) => {
  const query = `SELECT * FROM Students WHERE Email LIKE '${Email}';`;
  connection.query(query, callback);
};

exports.removeFromReservation = (reservation, id, callback) => {
  const query = `DELETE FROM Reservations WHERE TimeOfRes like '${reservation}';SELECT TimeOfRes,S_ID FROM Reservations WHERE H_ID = ${id}`;
  connection.query(query, callback);
};
