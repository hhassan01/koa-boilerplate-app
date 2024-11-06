import {
  up as createIssuesTable,
  down as dropIssuesTable,
} from "./1-create-issues-table";
import {
  up as createRevisionsTable,
  down as dropRevisionsTable,
} from "./2-create-revisions-table";

import sequelize from "../lib/models/connection";

async function runMigrations(direction: "up" | "down" = "up") {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    if (direction === "up") {
      // 1
      await createIssuesTable(sequelize.getQueryInterface());
      console.log("Migration applied: createIssuesTable");
      
      // 2
      await createRevisionsTable(sequelize.getQueryInterface());
      console.log("Migration applied: createRevisionsTable");
    } else if (direction === "down") {
      await dropIssuesTable(sequelize.getQueryInterface());
      console.log("Migration reverted: createIssuesTable");
      await dropRevisionsTable(sequelize.getQueryInterface());
      console.log("Migration reverted: createRevisionsTable");
    }
  } catch (error) {
    console.error(`Failed to run ${direction} migrations:`, error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

const direction = (process.argv[2] as "up" | "down") || "up";
runMigrations(direction);
