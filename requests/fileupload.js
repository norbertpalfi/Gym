const express = require('express'),
  fs = require('fs'),
  db = require('../database/database');

const frouter = express.Router();


frouter.post('/halls/:id', (request, response) => {
  const fileHandler = request.files.myfile;
  const ID = request.params.id;
  let piece = fileHandler.path.split('uploadDir\\');
  if (piece[1] === 'undefined') {
    piece = fileHandler.path.split('uploadDir/');
  }
  if (!fileHandler.name) {
    fs.unlink(`static/uploadDir/${piece[1]}`, (err) => {
      if (err) throw err;
    });
    db.deletePhotoOf(ID, (err) => {
      if (err) {
        response.status(500).send(`Selections not ok: ${err.message}`);
      }
      response.redirect(`/halls/${ID}`);
    });
  } else {
    db.addPhotoOf(ID, fileHandler, piece[1], (err) => {
      if (err) {
        response.status(500).send(`Selections not ok :( ${err.message}`);
      } else {
        response.redirect(`/halls/${ID}`);
      }
    });
  }
});


module.exports = frouter;
