const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./user");
const Job = require("./job");

const JobMapping = sequelize.define(
  "JobMapping",
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active',
    }
  }, 
  {
    timestamps: true,
  });

// Define associations
JobMapping.belongsTo(User, { foreignKey: "user_id" });
JobMapping.belongsTo(Job, { foreignKey: "job_id" });

module.exports = JobMapping;
