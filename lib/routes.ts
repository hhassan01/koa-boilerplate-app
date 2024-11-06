import Router from "koa-router";

import discovery from "./api/discovery";
import health from "./api/health";
import IssuesHandler from "./api/issues";
import authenticate from "./middleware/authenticate";
import AuthHandler from "./api/authenticate";

const publicRouter = new Router();
const privateRouter = new Router();

publicRouter.get("/", discovery);
publicRouter.get("/health", health);
publicRouter.post("/auth/token", AuthHandler.getToken);

privateRouter.use(authenticate);
privateRouter.get("/issues", IssuesHandler.getAll);
privateRouter.get("/issues/:id", IssuesHandler.get);
privateRouter.post("/issues", IssuesHandler.create);
privateRouter.put("/issues/:id", IssuesHandler.update);
privateRouter.get("/issues/:id/revisions", IssuesHandler.getRevisions);

export { publicRouter, privateRouter };
