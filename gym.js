const express = require('express'),
  fs = require('fs'),
  path = require('path'),
  morgan = require('morgan'),
  eformidable = require('express-formidable'),
  exphbs = require('express-handlebars'),
  requestRoutes = require('./requests/requests'),
  fRoutes = require('./requests/fileupload'),
  api = require('./requests/api');

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const staticDir = path.join(__dirname, 'static');

const uploadDir = path.join(__dirname, 'static/uploadDir');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(morgan('tiny'));
app.use(express.static(staticDir));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', requestRoutes);

app.use('/api/', api);

app.use(eformidable({ uploadDir, keepExtensions: true }));
app.use('/', fRoutes);


app.listen(8080, () => { console.log('Listening on port 8080'); });
