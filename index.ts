import Koa from 'koa';
import yamljs from 'yamljs';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';

import config from './config';
import sequelize from './lib/models/connection';
import { publicRouter, privateRouter } from './lib/routes';

const app = new Koa();

const spec = yamljs.load('./docs/bundled-api.yaml');
publicRouter.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

app.use(bodyParser());

// Public routes (No authentication required)
app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

// Private routes (Require authentication)
app.use(privateRouter.routes());
app.use(privateRouter.allowedMethods());

// Handling DB connection and errors before setting up server
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

const port = config.port || 8080;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
});

export default app;
