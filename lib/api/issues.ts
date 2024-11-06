import { Context } from "koa";

import respond from "./responses";
import Revision from "../models/revision";
import Issue, { IssueCreationAttributes } from "../models/issue";
import { handleRequest } from "../utils/handleRequest";
import { withTransaction } from "../utils/withTransaction";

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
    const newIssue = await withTransaction(async (transaction) => {
      const issue = await Issue.create(context.request.body as Issue, {
        transaction,
      });

      await Revision.create(
        {
          issueId: issue.id,
          changes: { title: issue.title, description: issue.description },
          // @todo: To be fixed after Auth with JWT
          updatedBy: "unknown",
          updatedAt: new Date(),
        },
        { transaction }
      );

      return issue;
    });

    respond.success(context, { issue: newIssue }, 201);
  }),

  update: handleRequest(async (context: Context) => {
    const updatedIssue = await withTransaction(async (transaction) => {
      const issue = await Issue.findByPk(context.params.id);
      if (!issue) {
        return respond.notFound(context);
      }

      const changes: Record<string, unknown> = {};
      const updatedData = context.request.body as IssueCreationAttributes;

      (
        Object.keys(updatedData) as Array<keyof IssueCreationAttributes>
      ).forEach((key) => {
        if (updatedData[key] !== issue.getDataValue(key)) {
          changes[key] = updatedData[key];
        }
      });

      // @todo: Add logic for updatedBy here after Authentication module
      const updated = await issue.update(updatedData, { transaction });

      if (Object.keys(changes).length > 0) {
        await Revision.create(
          {
            issueId: updated.id,
            changes,
            // @todo: Add logic for updatedBy here after Authentication module
            updatedBy: "unknown",
            updatedAt: new Date(),
          },
          { transaction }
        );
      }

      return updated;
    });

    respond.success(context, { issue: updatedIssue });
  }),

  getRevisions: handleRequest(async (context: Context): Promise<void> => {
    const revisions = await Revision.findAll({
      where: { issueId: context.params.id },
      order: [["updated_at", "DESC"]],
    });

    if (revisions.length > 0) {
      respond.success(context, { revisions });
    } else {
      respond.notFound(context);
    }
  }),
};

export default IssuesHandler;
