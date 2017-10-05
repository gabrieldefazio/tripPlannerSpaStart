const router = require('express').Router();
const Hotel = require('../models').Hotel;
const Restaurant = require('../models').Restaurant;
const Activity = require('../models').Activity;
const Itinerary = require('../models').Itinerary;
const db = require('../models').db;

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

router.post('/itineraries', (req, res, next) => {
	Itinerary.create({})
	.then(newItinerary => {
		console.log("created", req.body)
		const hotelPromise = req.body.hotels.map(hotel => {
			return db.itinerary_hotel.create({
				db.itineraryId:newItinerary.id,
				hotelId:hotel.id
			})
		});

		const restaurantPromise = req.body.restaurants.map(restaurant => {
			return db.itinerary_restaurant.create({
				db.itineraryId:newItinerary.id,
				restaurantId:restaurant.id
			})
		});

		const activityPromise = req.body.activities.map(activity => {
			return db.itinerary_activity.create({
				db.itineraryId:newItinerary.id,
				activityId:activity.id
			})
		});
		let masterArray =hotelPromise.concat(restaurantPromise).concat(activityPromise);
		return Promise.all(masterArray);

	})
	.then(() => {
		res.json({'we' : 'b done'})
	})
})




















module.exports = router;