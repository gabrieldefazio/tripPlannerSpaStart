const mapboxgl = require("mapbox-gl");
const buildMarker = require("./marker.js");

mapboxgl.accessToken = 'pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g';

const map = new mapboxgl.Map({
  container: "map",
  center: [-74.009, 40.705], // FullStack coordinates
  zoom: 12, // starting zoom
  style: "mapbox://styles/mapbox/streets-v10" // mapbox has lots of different map styles available.
});

const state = {
	attractions : {},
	selectedAttractions : []
}

const makeOption = (attraction, selector) => {
	const option = new Option(attraction.name, attraction.id);
	const select = document.getElementById(selector);
	select.add(option);
};

const buildAttraction = (category, attraction) => {

	// Append Marker
	const newMarker = buildMarker(category, attraction.place.location);
	state.selectedAttractions.push({ id: attraction.id, category});

	newMarker.addTo(map);

	//Add Remove Button
	const removeButton = document.createElement('button');
	removeButton.className = 'remove-btn';
	removeButton.innerHTML = 'X';

	// Append Item to day
	
	const itineraryItem = document.createElement('li');
	itineraryItem.className = 'itinerary-item';
	
	itineraryItem.append(attraction.name, removeButton);
	document.getElementById(`${category}-list`).append(itineraryItem);

	removeButton.addEventListener('click', function remove(){
		
		// remove attraction from state;
		state.selectedAttractions = state.selectedAttractions.filter(
			selected => selected.id !== attraction.id
		);

		// remove attraction from the DOM
		itineraryItem.remove();
		newMarker.remove();
	})


}

const handleAddAttraction = attractionType => {
	const select = document.getElementById(`${attractionType}-choices`);
	const selectId = select.value;
	const selectedAttraction = state.attractions[attractionType].find(
		attraction => +attraction.id === +selectId
	);
	buildAttraction(attractionType, selectedAttraction)
}
const fetchAttractions = () => {
	fetch('/api')
	.then(res => {
		return res.json()
	})
	.then(parsedContent => {
		//add parsed Content to DOM
		state.attractions = parsedContent;
		const { hotels, restaurants, activities } = parsedContent;
		hotels.forEach(hotel => makeOption(hotel, 'hotels-choices'))
		restaurants.forEach(restaurant => makeOption(restaurant, 'restaurants-choices'))
		activities.forEach(activity => makeOption(activity, 'activities-choices'))
	})
	.catch(console.error)
}

[ 'hotels', 'restaurants', 'activities'].forEach(attraction => {
	document
		.getElementById(`${attraction}-add`)
		.addEventListener('click', () => handleAddAttraction(attraction))

})

const fetchItineraries = (id) => {
	fetch(`/api/itineraries/${id}`)
	.then(result => result.json())
	.then(itinerary => {
		itinerary.hotels.forEach(hotel => buildAttraction("hotels", hotel));
		itinerary.restaurants.forEach(restaurant => buildAttraction("restaurants", restaurant));
		itinerary.activities.forEach(activity => buildAttraction("activities", activity));
		console.log("itineraries", itinerary);
	})
}

const postItin = () => {
	let reqBody ={
		hotels:[],
		restaurants:[],
		activities:[]
	};

	state.selectedAttractions.forEach(attraction => {
		reqBody[attraction.category].push(attraction.id);
	});

	console.log("YOOOOOOO", reqBody);
	
	fetch('/api/itineraries', {
		method: 'POST',
		headers : {
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify(reqBody)
	})
}

let saveButton = document.getElementById("save_itin");
saveButton.addEventListener('click', postItin);
// fetchItineraries(1);














fetchAttractions();


