import { Context } from "koa";
import { Op } from "sequelize";

import respond from "./responses";
import Revision from "../models/revision";
import { handleRequest } from "../utils/handleRequest";
import { withTransaction } from "../utils/withTransaction";
import Issue, { IssueCreationAttributes } from "../models/issue";

interface IssueState {
  title?: string;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
}

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
      const issue = await Issue.create(
        {
          ...(context.request.body as IssueCreationAttributes),
          createdBy: context.state.user?.email,
        },
        {
          transaction,
        }
      );

      await Revision.create(
        {
          issueId: issue.id,
          changes: { title: issue.title, description: issue.description },
          updatedBy: issue.createdBy,
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

      const updated = await issue.update(
        {
          ...updatedData,
          updatedBy: context.state.user?.email,
        },
        { transaction }
      );

      if (Object.keys(changes).length > 0) {
        await Revision.create(
          {
            issueId: updated.id,
            changes,
            updatedBy: updated.updatedBy,
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

  compareRevisions: handleRequest(async (context: Context) => {
    const { issueId, revisionAId, revisionBId } = context.params;

    const revisionA = await Revision.findOne({
      where: { issueId, id: revisionAId },
    });
    const revisionB = await Revision.findOne({
      where: { issueId, id: revisionBId },
    });

    if (!revisionA || !revisionB) {
      respond.notFound(context, "One or both revisions not found");
      return;
    }

    const allRevisions = await Revision.findAll({
      where: {
        issueId,
        id: { [Op.lte]: Math.max(revisionA.id, revisionB.id) },
      },
      order: [["updated_at", "ASC"]],
    });

    // Function to get state at a specific revision
    const getStateAtRevision = (revisionId: number): IssueState => {
      let state: IssueState = {};
      for (const rev of allRevisions) {
        state = { ...state, ...rev.changes };
        if (rev.id === revisionId) break;
      }
      return state;
    };

    const before: IssueState = getStateAtRevision(revisionA.id);
    const after: IssueState = getStateAtRevision(revisionB.id);

    const changes: Record<string, { before: unknown; after: unknown }> = {};
    (Object.keys({ ...before, ...after }) as Array<keyof IssueState>).forEach(
      (key) => {
        if (before[key] !== after[key]) {
          changes[key] = { before: before[key], after: after[key] };
        }
      }
    );

    const start = revisionA.updatedAt < revisionB.updatedAt ? revisionA.updatedAt : revisionB.updatedAt;
    const end = revisionA.updatedAt > revisionB.updatedAt ? revisionA.updatedAt : revisionB.updatedAt;
    const order = revisionA.updatedAt < revisionB.updatedAt ? 'ASC' : 'DESC';

    const revisionTrail = await Revision.findAll({
      where: {
        issueId,
        updatedAt: {
          [Op.between]: [start, end],
        },
      },
      order: [['updated_at', order]],
    });

    context.body = {
      before,
      after,
      changes,
      revisions: revisionTrail,
    };
  }),
};

export default IssuesHandler;
