import { Context } from 'koa';

interface ResponseData {
  [key: string]: unknown;
}

interface ResponseHandler {
  success: (context: Context, data: ResponseData, statusCode?: number) => void;
  badRequest: (context: Context, errors: unknown) => void;
  notFound: (context: Context) => void;
  unauthorized: (context: Context, message?: string) => void;
}

const responses: ResponseHandler = {
  success: (context, data, statusCode): void => {
    context.body = data;
    context.status = statusCode ? statusCode : data ? 200 : 204;
  },
  badRequest: (context, errors): void => {
    context.body = {
      message: 'Check your request parameters',
      errors,
    };
    context.status = 400;
  },
  notFound: (context): void => {
    context.body = { message: 'Resource was not found' };
    context.status = 404;
  },
  unauthorized: (context, message): void => {
    context.body = { message: message ?? 'Authorization token required' };
    context.status = 401;
  }
};

export default responses;
