const express = require('express'),
  db = require('../database/database');

const router = express.Router();

router.get('/halls', (req, res) => {
  db.getHalls((err, result) => {
    if (err) {
      res.status(500).send(`Insertion unsuccessful: ${err.message}`);
    } else {
      res.send(result);
    }
  });
});

router.get('/timetable/:id', (req, res) => {
  db.getTimetableID(req, (err, reservations) => {
    if (err) {
      res.status(500).send('Bad selection');
    } else {
      res.send(reservations);
    }
  });
});

router.get('/halls/:param', (req, res) => { /* eslint no-restricted-globals: ["error", "event"] */
  const { param } = req.params;
  if (param.match(/[^\d]/)) {
    db.hallExists(param)
      .then((exists) => {
        if (!exists) {
          return res.status(404).json({ message: `No hall with that type ${param}.` });
        }
        return db.getHallsLike(param)
          .then((Halls) => res.json(Halls));
      })
      .catch((err) => res.status(500).json({ message: `Error finding hall with type ${err}` }));
  } else {
    db.hallExistsID(param)
      .then((exists) => {
        if (!exists) {
          return res.status(404).json({ message: `No hall with that ID ${param}.` });
        }
        return db.getHallID(param)
          .then((Halls) => res.json(Halls));
      })
      .catch((err) => res.status(500).json({ message: `Error finding hall with ID ${err}` }));
  }
});

router.delete('/timetable/:reservation/:id', (req, res) => {
  db.removeFromReservation(req.params.reservation, req.params.id,
    (err, reservations) => {
      if (err) {
        res.status(500).send('Bad selection');
      } else {
        res.send(reservations[1]);
      }
    });
});

router.delete('/halls/:id', (req, res) => { /* eslint no-restricted-globals: ["error", "isNaN"] */
  const param = req.params.id;
  if (!param.match(/[^\d]/)) {
    db.hallExistsID(param)
      .then((exists) => {
        if (!exists) {
          return res.status(404).json({ message: `No hall with that ID ${param}.` });
        }
        return db.deleteHallID(param)
          .then((Halls) => res.json(Halls));
      })
      .catch((err) => res.status(500).json({ message: `Error finding hall with ID ${err}` }));
  } else {
    res.status(500).json({ message: 'Please provide a number for the ID.' });
  }
});

router.post('/halls', (req, res) => {
  if (!req.body.pph || !req.body.type) {
    res.status(500).send('Please add pph, and type');
  }
  // here we could check for every parameter to be ok but i dont know if that is necessary right now
  if (!req.body.amount) {
    return db.insertHallsWithoutAmount(req.body.type, req.body.pph)
      .then((Halls) => res.json(Halls));
  }
  return db.insertHallsWithAmount(req.body.type, req.body.pph, req.body.amount)
    .then((Halls) => res.json(Halls));
});

router.patch('/halls/:id', (req, res) => {
  if (!req.body.pph && !req.body.type) {
    res.status(500).send('Please add pph or type');
  }
  if (!req.body.amount) {
    return db.modifyHallsWithoutAmount(req.body.type, req.body.pph, req.params.id)
      .then((Halls) => res.json(Halls));
  }
  return db.modifyHallsWithAmount(req.body.type, req.body.pph, req.body.amount, req.params.id)
    .then((Halls) => res.json(Halls));
});

module.exports = router;
