const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  socketPath: process.env.DB_SOCKET_PATH,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
});

module.exports = dbConnection.promise();
