import jwt from "jsonwebtoken";
import { Context, Next } from "koa";

import config from "../../config";
import responses from "../api/responses";

async function authenticate(context: Context, next: Next) {
  const token = context.headers.authorization?.split(" ")[1];
  if (!token) {
    responses.unauthorized(context);
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { email: string };
    context.state.user = decoded;
    await next();
  } catch (error) {
    responses.unauthorized(context, "Invalid or expired token");
  }
}

export default authenticate;
