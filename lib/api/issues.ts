import { Context } from 'koa';

import respond from './responses';
import Issue from '../models/issue';

const Issues = {
  get: async (context: Context): Promise<void> => {
    const issue = await Issue.findByPk(context.params.id);
    respond.success(context, { issue });
  },
  getAll: async (context: Context): Promise<void> => {
    console.log("paring")
    const issue = await Issue.findAll();
    console.log({issue})
    respond.success(context, { issue });
  }
};

export default Issues;
