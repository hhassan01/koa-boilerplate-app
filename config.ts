interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

interface Config {
  port: number;
  mysql: MySQLConfig;
}

const config: Config = {
  port: parseInt(process.env.PORT as string, 10),
  mysql: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    port: parseInt(process.env.DB_PORT as string, 10),
  }
};

export default config;