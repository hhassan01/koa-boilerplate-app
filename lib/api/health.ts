import { Context } from 'koa';

import respond from './responses';

const health = (context: Context): void => {
  respond.success(context, {
    message: 'OK',
  });
};

export default health;
