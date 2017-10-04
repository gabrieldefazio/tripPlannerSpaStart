const router = require('express').Router();
const Hotel = require('../models').Hotel;
const Restaurant = require('../models').Restaurant;
const Activity = require('../models').Activity;
const Itinerary = require('../models').Itinerary;

router.get('/', (req, res, next) => {
	Promise.all([
		Hotel.findAll({include : [{all : true}]}),
		Restaurant.findAll({include : [{all : true}]}),
		Activity.findAll({include : [{all : true}]})
	])
	.then(([hotels, restaurants, activities]) => {
		res.json({
			hotels,
			restaurants,
			activities
		})
	})
	.catch(next)	
})

router.get('/itineraries/:itinerary_id', (req, res, next) => {
	Itinerary.findOne({
		where:{
			id:req.params.itinerary_id
		},
		include:[{all:true, nested:true}]
	})
	.then((result) => {
		res.json(result);
	});
})

module.exports = router;