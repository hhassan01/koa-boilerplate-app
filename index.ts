import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import config from './config';
import router from './lib/routes';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const port = config.port || 8080;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});

export default app;
