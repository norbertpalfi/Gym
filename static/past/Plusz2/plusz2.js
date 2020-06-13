function getMousePos(canvas, evt) { // eslint-disable-line no-unused-vars
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function draw(array) { // eslint-disable-line no-unused-vars
  const ctx = document.getElementById('canvas').getContext('2d');
  for (let i = 0; i < 12; i += 1) {
    for (let j = 0; j < 16; j += 1) {
      ctx.fillStyle = array[Math.floor(Math.random() * array.length)];
      ctx.fillRect(j * 50, i * 50, 50, 50);
    }
  }
}

function Game(difficulty) { // eslint-disable-line no-unused-vars
  document.getElementById('easy').style.display = 'none';
  document.getElementById('medium').style.display = 'none';
  document.getElementById('hard').style.display = 'none';
  const colors = ['red', 'green', 'blue', 'yellow', 'cyan'];
  const diffColors = [];
  for (let i = 0; i < difficulty; i += 1) {
    diffColors.push(colors[i]);
  }
  draw(diffColors);
}


function delCells(x, y, fieldsColor, count) {
  const ctx = document.getElementById('canvas').getContext('2d');
  const canvasData = ctx.getImageData(x, y, 50, 50),
    pix = canvasData.data;

  if (fieldsColor[0] === pix[0] && fieldsColor[1] === pix[1] && fieldsColor[2] === pix[2]) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, 50, 50);
  } else {
    return 0;
  }
  delCells(x - 50, y, fieldsColor, count + 1);
  delCells(x, y + 50, fieldsColor, count + 1);
  delCells(x + 50, y, fieldsColor, count + 1);
  delCells(x, y - 50, fieldsColor, count + 1);
  return 0;
}

function removeColor(evt) { // eslint-disable-line no-unused-vars
  const canvas = document.getElementById('canvas').getContext('2d');
  const ctx = document.getElementById('canvas').getContext('2d');
  const pos = getMousePos(canvas, evt);

  let x = pos.x % 50;
  x = pos.x - x;
  let y = pos.y % 50;
  y = pos.y - y;
  const canvasData = ctx.getImageData(x, y, 50, 50),
    pix = canvasData.data;
  const count = 0;
  delCells(x, y, [pix[0], pix[1], pix[2]], count);
  console.log(count);
  document.getElementById('score').innerHTML = `${count}`;
}
