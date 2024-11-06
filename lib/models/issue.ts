import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "./connection";

interface IssueAttributes {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueCreationAttributes
  extends Optional<IssueAttributes, "id" | "createdBy" | "updatedBy"> {}
class Issue
  extends Model<IssueAttributes, IssueCreationAttributes>
  implements IssueAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public createdBy!: string;
  public updatedBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 100],
          msg: "Title must be between 5 and 100 characters",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description cannot be empty" },
        len: {
          args: [10, 255],
          msg: "Description must be between 10 and 255 characters",
        },
      },
    },
    createdBy: {
      type: DataTypes.STRING,
      // @todo: Will be replaced with user's email once Auth is implemented
      allowNull: false,
      defaultValue: "unknown",
      field: "created_by",
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "updated_by",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "issues",
    timestamps: true,
  }
);

export default Issue;
