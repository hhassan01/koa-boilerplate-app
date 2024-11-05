import { Context } from 'koa';

import respond from './responses';
import Issue from '../models/issue';

const Issues = {
  get: async (context: Context): Promise<void> => {
    const issue = await Issue.findByPk(context.params.id);
    respond.success(context, { issue });
  },
  getAll: async (context: Context): Promise<void> => {
    const issues = await Issue.findAll();
    respond.success(context, { issues });
  }
};

export default Issues;
