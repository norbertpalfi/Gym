const express = require('express'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs'),
  cookieParser = require('cookie-parser'),
  verification = require('../middleware/verification'),
  tokenVerification = require('../middleware/tokenVerification'),
  db = require('../database/database');

const router = express.Router();
router.use(cookieParser());

router.get('/', tokenVerification.auth, (req, res) => {
  db.getHalls((err, result) => {
    if (err) {
      res.status(500).send(`Insertion unsuccessful: ${err.message}`);
    } else {
      res.render('startpage', {
        halls: result,
        data: req.data,
      });
    }
  });
});

router.get('/halls', tokenVerification.auth, (req, res) => {
  db.getHalls((err, result) => {
    if (err) {
      res.status(500).send(`Insertion unsuccessful: ${err.message}`);
    } else if (req.data && req.data.admin === 2) {
      res.render('utilities', {
        title: 'Add items',
        halls: result,
        data: req.data,
      });
    } else {
      res.render('staffonly', {
        data: req.data,
      });
    }
  });
});

router.get('/timetable/', tokenVerification.auth, (req, res) => {
  db.getTimetable(req.data.email, (err, [halls, students]) => {
    if (err) {
      res.status(500).send(`Insertion unsuccessful: ${err.message}`);
    } else if (req.data) {
      res.render('timetable', {
        halls,
        students,
        data: req.data,
      });
    } else {
      res.render('usersonly');
    }
  });
});

router.get('/halls/:id', tokenVerification.auth, (req, res) => {
  db.getPhotoOf(req, (err, result) => {
    if (err) {
      res.status(500).send(`Get unsuccessful: ${err.message}`);
    } else {
      const first = result[0];
      if (first.PPH) {
        if (req.data && req.data.admin === 2) {
          res.render('photos', {
            info: result,
            PPH: first.PPH,
            AMOUNT: first.AMOUNT,
            ID: req.params.id,
            data: req.data,
            adminPics: 'Yes',
          });
        } else {
          res.render('photos', {
            info: result,
            PPH: first.PPH,
            AMOUNT: first.AMOUNT,
            ID: req.params.id,
            data: req.data,
          });
        }
      } else {
        res.send('No such id in the database');
      }
    }
  });
});

router.post('/timetable/', (req, res) => {
  const { data } = req;
  if (!req.body.name || !req.body.roomID || !req.body.dateTime) {
    db.fillSelects((err, [halls, students]) => {
      if (err) {
        res.status(500).send(`Insertion unsuccessful: ${err.message}`);
      } else {
        res.render('timetable', {
          halls,
          students,
          fillDate: 'Please fill in a date',
          data,
        });
      }
    });
  } else {
    const dateParser = req.body.dateTime.split('T');
    db.sameRoom(req, (err, reservationsForRoom) => {
      if (err) {
        res.status(500).send(`Insertion unsuccessful: ${err.message}`);
      } else {
        let ok = true;
        reservationsForRoom.forEach((element) => {
          const helper = element.TimeOfRes.split(' ');
          const udate = helper[1].split(':');
          const date = dateParser[1].split(':');
          if (helper[0] === dateParser[0]
            && Math.abs((100 * udate[0] + udate[1]) - (100 * date[0] + date[1])) < 200) {
            ok = false;
          }
        });

        db.insertReservation(req, dateParser, (suberr, [halls, students]) => {
          if (suberr) {
            res.status(500).send(`Insertion unsuccessful: ${suberr.message}`);
          } else if (ok) {
            res.render('timetable', {
              halls,
              students,
              allSet: 'ok',
              data,
            });
          } else {
            res.render('timetable', {
              halls,
              students,
              occupied: 'ok',
              data,
            });
          }
        });
      }
    });
  }
});

router.post('/halls', verification.everythingOK, (req, res) => {
  switch (req.body.hallutil) {
    case 'object': {
      db.insertObject(req, (err) => {
        if (err) {
          res.status(500).send(`Insertion unsuccessful: ${err.message}`);
        } else {
          res.redirect('/halls');
        }
      });
      break;
    }
    case 'room': {
      db.insertRoom(req, (err) => {
        if (err) {
          res.status(500).send(`Insertion unsuccessful: ${err.message}`);
        } else {
          res.redirect('/halls');
        }
      });
      break;
    }
    default: {
      res.status(400).send('Please send valid data');
      break;
    }
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password
    || !req.body.password2 || !req.body.authlevel) {
    res.render('register', {
      empty: 'empty',
    });
  } else if (req.body.password !== req.body.password2) {
    res.render('register', {
      samePass: 'same',
    });
  } else {
    db.checkEmail(req.body.email, (err1, result) => {
      if (err1) {
        res.status(500).send(`Selection unsuccessful: ${err1.message}`);
      } else if (result[0]) {
        res.render('register', {
          alreadyRegistered: 'alreadyIn',
        });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        db.insertNewUser(req.body.name, req.body.email, hashPassword, req.body.authlevel, (err) => {
          if (err) {
            res.status(500).send(`Insertion unsuccessful: ${err.message}`);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.render('login', {
      empty: 'empty',
    });
  } else {
    db.checkEmail(req.body.email, (err, [result]) => {
      if (err) {
        res.send('Error selecting mail');
      } else if (result) {
        const rightPass = bcrypt.compareSync(req.body.password, result.UserPass);
        if (rightPass) {
          const admin = result.AuthLevel;
          const token = jwt.sign({ email: req.body.email, admin }, '@WorldOfDiver');
          res.cookie('auth', token);
          res.cookie('23159o8iy124awno541i5098fdj1309i4', result.S_ID);
          res.redirect('/');
        } else {
          res.render('login', {
            wrongInput: 'Wrong',
          });
        }
      } else {
        res.render('login', {
          wrongInput: 'Wrong',
        });
      }
    });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/');
});

module.exports = router;
