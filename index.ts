import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
// [@NOTE]: Dot env is set before local imports
// to ensure that env variables are set for all local files
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

import config from './config';
import router from './lib/routes';
import sequelize from './lib/models/connection';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

// Handling DB connection and errors before setting up server
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
})

const port = config.port || 8080;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});

export default app;
