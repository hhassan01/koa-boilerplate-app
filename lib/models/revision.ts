import { DataTypes, Model, Optional } from "sequelize";

import Issue from "./issue";
import sequelize from "./connection";

interface RevisionAttributes {
  id: number;
  issueId: number;
  changes: Record<string, unknown>;
  updatedBy: string;
  updatedAt: Date;
}

interface RevisionCreationAttributes
  extends Optional<RevisionAttributes, "id"> {}
class Revision
  extends Model<RevisionAttributes, RevisionCreationAttributes>
  implements RevisionAttributes
{
  public id!: number;
  public issueId!: number;
  public changes!: Record<string, unknown>;
  public updatedBy!: string;
  public updatedAt!: Date;
}

Revision.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    issueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Issue,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      field: "issue_id",
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      // @todo: Will be replaced with user's email once Auth is implemented
      allowNull: false,
      defaultValue: "unknown",
      field: "updated_by",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "revisions",
    timestamps: false,
  }
);

export default Revision;
