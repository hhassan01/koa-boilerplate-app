import { Context } from 'koa';

interface ResponseData {
  [key: string]: unknown;
}

interface ErrorDetail {
  message?: string;
  field?: string;
  [key: string]: unknown;
}

interface ResponseHandler {
  success: (context: Context, data: ResponseData) => void;
  badRequest: (context: Context, errors: ErrorDetail[] | string[]) => void;
  notFound: (context: Context) => void;
}

const responses: ResponseHandler = {
  success: (context: Context, data: ResponseData): void => {
    context.body = data;
    context.status = data ? 200 : 204;
  },
  badRequest: (context: Context, errors: ErrorDetail[] | string[]): void => {
    context.body = {
      message: 'Check your request parameters',
      errors,
    };
    context.status = 400;
  },
  notFound: (context: Context): void => {
    context.body = { message: 'Resource was not found' };
    context.status = 404;
  },
};

export default responses;
