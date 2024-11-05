import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from './connection';

interface IssueAttributes {
  id: number;
  title: string;
  description: string;
  created_by: string;
  updated_by: string;
}

interface IssueCreationAttributes extends Optional<IssueAttributes, 'id' | 'created_by' | 'updated_by'> {}
class Issue extends Model<IssueAttributes, IssueCreationAttributes> implements IssueAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [5, 100], msg: "Title must be between 5 and 100 characters" },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description cannot be empty" },
        len: { args: [10, 255], msg: "Description must be between 10 and 255 characters" },
      },
    },
    created_by: {
      type: DataTypes.STRING,
      // @todo: Will be replaced with user's email once Auth is implemented
      allowNull: false,
      defaultValue: 'unknown',
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'issues',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Issue;
