function ok() { // eslint-disable-line no-unused-vars
  const ok1 = document.getElementById('hallutil').value;
  if (ok1 === 'object') {
    document.getElementById('toBeHidden').style.display = 'inherit';
  } else {
    document.getElementById('amount').value = '';
    document.getElementById('toBeHidden').style.display = 'none';
  }
}

function snackbar() {
  const x = document.getElementById('snackbar');
  x.className = 'show';
  setTimeout(() => { x.className = x.className.replace('show', ''); }, 3000);
}

function solveTimetable(ID, responseText) { // eslint-disable-line no-unused-vars
  const tempString = document.cookie.split('23159o8iy124awno541i5098fdj1309i4=');
  let value = '-1';
  if (tempString[1]) {
    value = tempString[1].split(';');
  }
  const item = JSON.parse(responseText);
  if (item.length > 0) {
    document.getElementById(`occupied${ID}`).innerHTML = '<ol">';
    item.forEach((reservation) => {
      const oneReservation = reservation.TimeOfRes;
      const theID = reservation.S_ID;
      let button = '';
      if (parseInt(value, 10) === parseInt(theID, 10)) {
        button = `<input type="button" value="Remove reservation" class="btn btn-danger ml-4" onclick="removeReservation('${oneReservation}/${ID}')">`;
      }
      document.getElementById(`occupied${ID}`).innerHTML += `<li class="list-group-item list-group-item-info">${theID} has taken 2 hours from: ${oneReservation}${button}</li>`;
    });
    document.getElementById(`occupied${ID}`).innerHTML += '</ol>';
  } else {
    document.getElementById(`occupied${ID}`).innerHTML = 'Not reserved so far';
  }
}

function removeReservation(reservation) { // eslint-disable-line no-unused-vars
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `/api/timetable/${reservation}`);
  const ID = reservation.split('/')[1];
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 304) {
      solveTimetable(ID, xhr.responseText);
    } else {
      snackbar();
    }
  };
  xhr.send();
}

function getTimetable(ID) { // eslint-disable-line no-unused-vars
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', `/api/timetable/${ID}`);
  xhr.onload = () => {
    solveTimetable(ID, xhr.responseText);
  };
  xhr.send();
}
