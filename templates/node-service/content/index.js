const http = require('http');
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost'  ,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'score',
  port: process.env.DB_PORT || 3306
});

const requestHandler = async (request, response) => {
  console.log(request.url);

  // Run hello world query
  const [rows, fields] = await connection.promise().query('SELECT "This is an example application deployed with Score!" as message');

  const message = rows[0].message;

  const html = `
  <html>
    <body>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      <div class="container text-center mt-5 pt-5">
        <h1>Hello World!</h1>
        <p>${message}</p>
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