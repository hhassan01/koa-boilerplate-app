import { Context } from 'koa';

import respond from './responses';
import Issue from '../models/issue';

const Issues = {
  get: async (context: Context): Promise<void> => {
    const issue = await Issue.findByPk(context.params.id);
    if (issue) {
      respond.success(context, { issue });
    } else {
      respond.notFound(context);
    }
  },

  getAll: async (context: Context): Promise<void> => {
    const issues = await Issue.findAll();
    respond.success(context, { issues });
  },

  create: async (context: Context): Promise<void> => {
    try {
      const newIssue = await Issue.create(context.request.body as Issue);
      respond.success(context, { issue: newIssue }, 201);
    } catch (error) {
      respond.badRequest(context, error);
    }
  },

  update: async (context: Context): Promise<void> => {
    try {
      const issue = await Issue.findByPk(context.params.id);
      if (issue) {
        // @todo: Add logic for updated_by here after Authentication module
        const updatedIssue = await issue.update(context.request.body as Issue);
        respond.success(context, { issue: updatedIssue });
      } else {
        respond.notFound(context);
      }
    } catch (error) {
      respond.badRequest(context, error);
    }
  },
};

export default Issues;
