const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Connect to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});

// Define Article model
const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Sync models with the database
sequelize.sync();

module.exports = {
  sequelize,
  Article
};
