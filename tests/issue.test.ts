import sequelize from "../lib/models/connection";
import Issue, { IssueCreationAttributes } from "../lib/models/issue";

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database
});

afterAll(async () => {
  await sequelize.close();
});

describe("Issue Model", () => {
  it("should create an issue successfully", async () => {
    const issue = await Issue.create({
      title: "Sample Issue",
      description: "This is a sample issue for testing.",
      createdBy: "tester",
    } as IssueCreationAttributes);

    expect(issue.id).toBeDefined();
    expect(issue.title).toBe("Sample Issue");
    expect(issue.description).toBe("This is a sample issue for testing.");
    expect(issue.createdBy).toBe("tester");
  });

  it("should fail when title is too short", async () => {
    await expect(
      Issue.create({
        title: "1234",
        description: "Valid description",
        createdBy: "tester",
      } as IssueCreationAttributes)
    ).rejects.toThrow("Title must be between 5 and 100 characters");
  });

  it("should fail when description is empty", async () => {
    await expect(
      Issue.create({
        title: "Valid Title",
        description: "", // Empty description
        createdBy: "tester",
      } as IssueCreationAttributes)
    ).rejects.toThrow("Description cannot be empty");
  });
});
