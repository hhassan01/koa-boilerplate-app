import { Context } from "koa";
import jwt from "jsonwebtoken";

import respond from "./responses";
import config from "../../config";

const AuthHandler = {
  getToken: async (context: Context): Promise<void> => {
    const { email } = context.request.body as { email: string };
    if (!email) {
      respond.badRequest(context, new Error("Email should be provided"));
    }

    const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: "24h" });
    respond.success(context, { token });
  },
};

export default AuthHandler;
