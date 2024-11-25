import { Context } from 'koa';

import respond from '../api/responses';

export const handleRequest = (handler: (context: Context) => Promise<void>) => {
  return async (context: Context): Promise<void> => {
    try {
      await handler(context);
    } catch (error) {
      respond.badRequest(context, error);
    }
  };
};
