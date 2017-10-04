const Sequelize = require('sequelize');
const db = require('./_db');

const Itinerary = db.define('itinerary', {
    });

console.log("dbHotel", db.hotel);



module.exports = Itinerary;
