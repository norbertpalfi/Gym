const db = require('../database/database');

module.exports = {
  everythingOK(req, res, next) {
    if (!req.body.hallutil || !req.body.price) {
      db.getHalls((err, result) => {
        if (err) {
          res.status(500).send(`Selections not ok :( ${err.message}`);
        }
        res.render('utilities', {
          title: 'Main Page',
          halls: result,
          empty: 'All fields are required.',
        });
      });
    } else if (req.body.hallutil === 'object' && !req.body.amount) {
      db.getHalls((err, result) => {
        if (err) {
          res.status(500).send(`Selections not ok :( ${err.message}`);
        }
        res.render('utilities', {
          title: 'Main Page',
          halls: result,
          objnoamount: 'Objects must have amount!',
        });
      });
    } else if (req.body.hallutil === 'room' && req.body.amount) {
      db.getHalls((err, result) => {
        if (err) {
          res.status(500).send(`Selections not ok :( ${err.message}`);
        }
        res.render('utilities', {
          title: 'Main Page',
          halls: result,
          hallamount: 'true',
        });
      });
    } else {
      next();
    }
  },
};
