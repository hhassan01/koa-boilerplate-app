import sequelize from "../lib/models/connection";
import Issue, { IssueCreationAttributes } from "../lib/models/issue";
import Revision from "../lib/models/revision";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Revision Model", () => {
  let issue: Issue;

  beforeAll(async () => {
    issue = await Issue.create({
      title: "Issue for Revision",
      description: "Testing revisions.",
      createdBy: "tester",
    } as IssueCreationAttributes);
  });

  it("should create a revision successfully", async () => {
    const revision = await Revision.create({
      issueId: 11111111,
      changes: { title: "Updated Title" },
      updatedBy: "tester",
      updatedAt: new Date(),
    });
    
    expect(revision.id).toBeDefined();
    expect(revision.issueId).toBe(issue.id);
    expect(revision.changes).toEqual({ title: "Updated Title" });
    expect(revision.updatedBy).toBe("tester");
  });
});
