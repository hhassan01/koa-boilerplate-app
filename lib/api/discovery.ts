import { Context } from 'koa';

import respond from './responses';

const baseUrl = 'http://localhost:8080';

const discovery = (context: Context): void => {
  respond.success(context, {
    discovery: baseUrl,
  });
};

export default discovery;
