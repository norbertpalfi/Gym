function setErrorStyle(id) {
  document.getElementById(id).classList.add('error');
}

function removeErrorStyle(id) {
  document.getElementById(id).classList.remove('error');
}

function showSubmit() {
  document.getElementById('submit').style.display = 'inline-block';
}

function hideSubmit() {
  document.getElementById('submit').style.display = 'none';
  document.getElementById('details').innerHTML = '';
}

function lastModifiedDate() { // eslint-disable-line no-unused-vars
  document.getElementById('footerdate').innerHTML = document.lastModified;
}

function textToArray(id) {
  return document.getElementById(id).value.split(' ');
}

function nameValidation(name) {
  if (name === '') {
    document.getElementById('empty').innerHTML = 'All fields are required';
    return false;
  }
  if (name.match(/^[A-Z][a-z]+([ ][A-Z][a-z]+)+$/g)) {
    document.getElementById('nameNotOk').innerHTML = '';
    removeErrorStyle('name');
    removeErrorStyle('nameNotOk');
    return true;
  }
  document.getElementById('nameNotOk').innerHTML = 'Name field contains errors, please use format: John Smith';
  setErrorStyle('name');
  setErrorStyle('nameNotOk');
  return false;
}

function emailValidation() {
  const email = document.getElementById('email').value;
  if (email === '') {
    document.getElementById('empty').innerHTML = 'All fields are required';
    return false;
  }
  if (email.match(/@gmail\.com$/g) || email.match(/@yahoo\.com$/g)) {
    document.getElementById('emailNotOk').innerHTML = '';
    removeErrorStyle('email');
    removeErrorStyle('emailNotOk');
    return true;
  }
  document.getElementById('emailNotOk').innerHTML = 'Your email has to be gmail or yahoo';
  setErrorStyle('email');
  setErrorStyle('emailNotOk');
  return false;
}

function passwordValidation() {
  const password = document.getElementById('password').value;
  if (password === '') {
    document.getElementById('empty').innerHTML = 'All fields are required';
    return false;
  }
  if (password.length < 6) {
    document.getElementById('pwLessThanSix').innerHTML = 'Password has to be longer than 6 characters';
    document.getElementById('pwMoreThanTen').innerHTML = '';
    setErrorStyle('password');
    setErrorStyle('pwLessThanSix');
  }
  if (password.length > 10) {
    document.getElementById('pwMoreThanTen').innerHTML = 'Password has to be shorter than 10 characters';
    document.getElementById('pwLessThanSix').innerHTML = '';
    setErrorStyle('password');
    setErrorStyle('pwMoreThanTen');
  }
  if (password.match(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,10}$/g)) {
    document.getElementById('pwLessThanSix').innerHTML = '';
    document.getElementById('pwMoreThanTen').innerHTML = '';
    document.getElementById('pwBadPattern').innerHTML = '';
    removeErrorStyle('password');
    removeErrorStyle('pwLessThanSix');
    removeErrorStyle('pwMoreThanTen');
    removeErrorStyle('pwBadPattern');
    return true;
  }
  document.getElementById('pwBadPattern').innerHTML = 'The Password must contain atleast 1 number, and cannot be only numbers';
  setErrorStyle('password');
  setErrorStyle('pwBadPattern');
  return false;
}

function siteValidation() {
  const site = document.getElementById('site').value;
  if (site === '') {
    document.getElementById('empty').innerHTML = 'All fields are required';
    return false;
  }
  if (site.match(/^(https|ftp|file):\/\/(www\.)[-A-Za-z0-9_]+\.[-A-Za-z0-9_]+(\.[A-Za-z0-9_-]+)*$/g)) {
    document.getElementById('siteNotOk').innerHTML = '';
    removeErrorStyle('site');
    removeErrorStyle('siteNotOk');
    return true;
  }
  document.getElementById('siteNotOk').innerHTML = 'Website contains errors, please use format https://www.domain.sub_domain.sub-domain';
  setErrorStyle('site');
  setErrorStyle('siteNotOk');
  return false;
}

function validation() { // eslint-disable-line no-unused-vars
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const site = document.getElementById('site').value;

  if (nameValidation(name) && siteValidation() && emailValidation() && passwordValidation()) {
    document.getElementById('empty').innerHTML = '';
    document.getElementById('details').innerHTML = `Name:  ${name} <br /> Email: ${email} <br /> Site: ${site} <br /> Password: ${password}`;
    showSubmit();
    return true;
  }
  hideSubmit();
  document.getElementById('details').innerHTML = '';
  return true;
}


function concatArrays() {
  const firstArray = textToArray('textarea1');
  let secondArray = [];
  firstArray.forEach((i) => {
    firstArray.forEach((j) => {
      for (let k = 0; k < j.length; k += 1) {
        const x = i + j.substring(k, j.length);
        if (x.includes(j) === true) secondArray.push(x);
      }
      secondArray.push(i + j);
    });
  });

  secondArray = secondArray.reverse();
  return secondArray;
}


function moveText() { // eslint-disable-line no-unused-vars
  document.getElementById('printchatbox').innerHTML = document.getElementById('textarea2').value;
  const firstArray = textToArray('textarea1');
  const secondArray = concatArrays();
  const c = secondArray.concat(firstArray);
  let newString = document.getElementById('printchatbox').innerHTML;


  c.forEach((i) => {
    newString = newString.split(i).join(`<span class='highlight'>${i}</span>`);
    document.getElementById('printchatbox').innerHTML = newString;
  });
}
