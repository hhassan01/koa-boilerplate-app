import { Context } from 'koa';

interface ResponseData {
  [key: string]: unknown;
}

interface ResponseHandler {
  success: (context: Context, data: ResponseData, statusCode?: number) => void;
  badRequest: (context: Context, errors: unknown) => void;
  notFound: (context: Context) => void;
}

const responses: ResponseHandler = {
  success: (context: Context, data: ResponseData, statusCode): void => {
    context.body = data;
    context.status = statusCode ? statusCode : data ? 200 : 204;
  },
  badRequest: (context: Context, errors: unknown): void => {
    context.body = {
      message: 'Check your request parameters',
      errors,
    };
    context.status = 400;
  },
  notFound: (context: Context): void => {
    context.body = { message: 'Resource was not found' };
    context.status = 404;
  }
};

export default responses;
