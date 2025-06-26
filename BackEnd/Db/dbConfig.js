const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  // Use MAMP's MySQL settings
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root", // MAMP default password
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Evangadi-DB",
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  port: process.env.DB_PORT || 8889, // MAMP uses port 8889
});

module.exports = dbConnection.promise();
