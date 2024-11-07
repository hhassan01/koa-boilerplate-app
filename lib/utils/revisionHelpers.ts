import { WhereOptions, Order } from "sequelize";

import Revision from "../models/revision";

interface IssueState {
  title?: string;
  description?: string;
}

export async function fetchAllIssueRevisions(
  issueId: number,
  query: WhereOptions = {},
  order: Order = [["updated_at", "ASC"]]
) {
  return await Revision.findAll({
    where: {
      issueId,
      ...query,
    },
    order,
  });
}

export function getStateAtRevision(
  allRevisions: Revision[],
  revisionId: number
): IssueState {
  let state: IssueState = {};
  for (const rev of allRevisions) {
    state = { ...state, ...rev.changes };
    if (rev.id === revisionId) break;
  }
  return state;
}

export function calculateChangesInTwoRevisions(before: IssueState, after: IssueState) {
  const changes: Record<string, { before: unknown; after: unknown }> = {};
  (Object.keys({ ...before, ...after }) as Array<keyof IssueState>).forEach(
    (key) => {
      if (before[key] !== after[key]) {
        changes[key] = { before: before[key], after: after[key] };
      }
    }
  );
  return changes;
}
