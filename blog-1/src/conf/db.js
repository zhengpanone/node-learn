const env = process.env.NODE_ENV;

let MYSQL_CONF;
let REDIS_CONF;

if (env === "dev") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "root",
    port: "3306",
    database: "myblog",
  };
  REDIS_CONF = { host: "localhost", port: "6379" };
}
if (env === "pro") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "root",
    port: "3306",
    database: "myblog",
  };
  REDIS_CONF = { host: "localhost", port: "6379" };
}

module.exports = { MYSQL_CONF, REDIS_CONF };
