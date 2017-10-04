const Sequelize = require('sequelize');
const db = require('./_db');

const Place = require('./places');
const Restaurant = require('./restaurants')
const Activity = require('./activities');
const Hotel = require('./hotels');

Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);

module.exports = {
	db,
	Place,
	Hotel,
	Restaurant,
	Activity
};