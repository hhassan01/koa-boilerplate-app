import { Context } from "koa";

import respond from "./responses";
import Issue from "../models/issue";
import { handleRequest } from "../utils/handleRequest";

const IssuesHandler = {
  get: async (context: Context): Promise<void> => {
    const issue = await Issue.findByPk(context.params.id);
    if (issue) {
      respond.success(context, { issue });
    } else {
      respond.notFound(context);
    }
  },

  getAll: async (context: Context): Promise<void> => {
    const page = parseInt(context.query.page as string, 10) || 1;
    const pageSize = parseInt(context.query.pageSize as string, 10) || 10;

    const offset = (page - 1) * pageSize;

    const { count, rows: issues } = await Issue.findAndCountAll({
      limit: pageSize,
      offset,
    });

    respond.success(context, {
      issues,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  },

  create: handleRequest(async (context: Context) => {
    const newIssue = await Issue.create(context.request.body as Issue);
    respond.success(context, { issue: newIssue }, 201);
  }),

  update: handleRequest(async (context: Context) => {
    const issue = await Issue.findByPk(context.params.id);
    if (issue) {
      // @todo: Add logic for updated_by here after Authentication module
      const updatedIssue = await issue.update(context.request.body as Issue);
      respond.success(context, { issue: updatedIssue });
    } else {
      respond.notFound(context);
    }
  }),
};

export default IssuesHandler;
