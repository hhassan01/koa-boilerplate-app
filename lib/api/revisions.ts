import { Context } from "koa";
import { Op } from "sequelize";

import respond from "./responses";
import Revision from "../models/revision";
import { handleRequest } from "../utils/handleRequest";
import {
  calculateChangesInTwoRevisions,
  fetchAllIssueRevisions,
  getStateAtRevision,
} from "../utils/revisionHelpers";

const RevisionsHandler = {
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

    const [revisionA, revisionB] = await Promise.all([
      Revision.findOne({ where: { issueId, id: revisionAId } }),
      Revision.findOne({ where: { issueId, id: revisionBId } }),
    ]);

    if (!revisionA || !revisionB) {
      respond.notFound(context, "One or both revisions not found");
      return;
    }

    // Determine the latest date for fetching all relevant revisions
    const latestDate =
      revisionA.updatedAt > revisionB.updatedAt
        ? revisionA.updatedAt
        : revisionB.updatedAt;
    // Define the dynamic order based on the relationship between revisionA and revisionB
    const order = revisionA.updatedAt < revisionB.updatedAt ? "ASC" : "DESC";

    const [allRevisions, revisionTrail] = await Promise.all([
      fetchAllIssueRevisions(issueId, { updatedAt: { [Op.lte]: latestDate } }),
      fetchAllIssueRevisions(
        issueId,
        {
          updatedAt: {
            [Op.between]: [
              revisionA.updatedAt < revisionB.updatedAt
                ? revisionA.updatedAt
                : revisionB.updatedAt,
              revisionA.updatedAt > revisionB.updatedAt
                ? revisionA.updatedAt
                : revisionB.updatedAt,
            ],
          },
        },
        [["updated_at", order]]
      ),
    ]);

    const [before, after] = [
      getStateAtRevision(allRevisions, revisionA.id),
      getStateAtRevision(allRevisions, revisionB.id),
    ];

    const changes = calculateChangesInTwoRevisions(before, after);

    context.body = {
      before,
      after,
      changes,
      revisions: revisionTrail,
    };
  }),
};

export default RevisionsHandler;
