import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

import config from '../../config';

// We have to make sure that DB exists
mysql.createConnection({
  user: config.mysql.user,
  password: config.mysql.password,
}).then((connection) => {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${config.mysql.database};`)
}).catch((error) => {
  console.error('Error connecting DB', error)
})

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
    },
  }
);

export default sequelize;
