const http = require('http');
const mysql = require('mysql2');

// create the connection to database
const host = process.env.DB_HOST || 'localhost';
const connection = mysql.createConnection({
  host,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'score',
  port: process.env.DB_PORT || 3306
});

const requestHandler = async (request, response) => {
  console.log(request.url);

  const message = process.env.MESSAGE || "Hello, World!";

  // Run hello world query
  const [rows, fields] = await connection.promise().query(
    'SELECT version() as version'
  );
  const version = rows[0].version;

  const html = `
  <html>
    <body>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
      <div class="container text-center mt-5 pt-5">
      <h1>${message}</h1>
      <p>This is an application talking to a MySQL <code>${version}</code> database on host <code>${host}</code>, deployed with Score!</p>
      </div>
    </body>
  </html>
  `

  response.end(html);
}

const server = http.createServer(requestHandler);

const port = process.env.PORT || 8080;

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});

// Exit the process when signal is received (For docker)
process.on('SIGINT', () => {
  process.exit();
});