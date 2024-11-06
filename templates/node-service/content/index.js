const http = require("http");
const { Client } = require("pg");

const host = process.env.DB_HOST || "localhost";
const client = new Client({
  host,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "secret",
  database: process.env.DB_DATABASE || "score",
  port: process.env.DB_PORT || 5432,
});

const requestHandler = async (request, response) => {
  console.log(request.url);

  const message = process.env.MESSAGE || "Hello, World!";

  // Run hello world query
  const serverVersionRes = await client.query(
    `SHOW server_version;`
  );
  const serverVersion = serverVersionRes.rows[0].server_version;

  const versionRes = await client.query(
    `SELECT version();`
  );
  const version = versionRes.rows[0].version;

  const html = `
  <html>
    <body>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
      <div class="container text-center mt-5 pt-5">
        <h1>${message}</h1>
        <p>This is an application talking to a PostgreSQL <code>${serverVersion}</code> database on host <code>${host}</code>, deployed with Score!</p>
        <p><code></p>
        <p>
          <pre>
          SELECT version();
          ${version}
          </pre>
        </p>
      </div>
    </body>
  </html>
  `;

  response.end(html);
};

const App = async () => {
  // create the connection to database
  await client.connect();

  const server = http.createServer(requestHandler);

  const port = process.env.PORT || 8080;

  server.listen(port, (err) => {
    if (err) {
      return console.log("something bad happened", err);
    }

    console.log(`server is listening on ${port}`);
  });
};

App();

// Exit the process when signal is received (For docker)
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    process.exit();
  });
});