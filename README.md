# Webprogramming laboratory assignments

1. Make sure you have MySql installed.
2. Check for the following items to be created:
  host: 'localhost',
  port: 3306,
  user: 'User',
  password: 'Password'
3. The database and all of its elements will be created when executing the /static/MyDiverCity.sql file.
4. In the console please run the pnim1858.js server file
5. Check out the site, and make sure you find everything you want in it
6. If you want to delete the content of the database, select the part where the code does that
7. If you want to delete the database itself, select the commented line in the first row

REST API
1. GET /api/halls 
2. GET /api/halls/:id
3. GET /api/halls/:object-hall - to filter only the objects or halls
4. DELETE /api/timetable/:reservation/:id - used by a function in the 6th lab
5. POST /api/halls - adds the items, please fill the body w type, pph, amount
6. PATCH /api/halls/:id - modify item