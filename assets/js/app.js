////// ID's from html////////
// #startBox = row that hold The original input fields
// #location = location input search bar
// #bar = checkbox for bars
// #restaurant = checkbox for restaurants
// #datePicker = pickDate
// #eventDump = data from eventify api
// #mapDump = data from google places

//-------------------------------------//
// // AutoComplete - Joe
function activatePlacesSearch() {
	var input = document.getElementById('location');
	var autocomplete = new google.maps.places.Autocomplete(input);
}
// End AutoComplete ADD

var map;


$(document).on("click", ".selectEvent", function () {
	var longitude = $(this).attr("data-long");
	var latitude = $(this).attr("data-lat");
	var lat = parseFloat(latitude);
	var lng = parseFloat(longitude);
	console.log(lat);
	console.log(lng);
	// Create the map
	var startLoc = { lat, lng };
	console.log(startLoc);
	map = new google.maps.Map(document.getElementById('mapDump'), {
		center: startLoc,
		zoom: 17
	});

	//Create the places service
	var service = new google.maps.places.PlacesService(map);

	// Perform a nearby search
	service.nearbySearch(
		{ location: startLoc, radius: 1500, type: ['restaurant'] },
		function (results, status, pagination) {
			if (status !== 'OK') return;
			console.log(results);
			createCardPlaces(results);
			// createMarkers(results);
		}

	)

	function createCardPlaces(places) {
		for (var i = 0; i < places.length; i++) {
			console.log(places[i].name, places[i].rating, places[i].opening_hours);
		}
	}

	// function createMarkers(place) {
	// 	var bounds = new google.maps.LatLngBounds();
	// 	var placesList = document.getElementById('placeDump');
	// 	console.log(placesList);

	// 	for (var i = 0, place; place = place[i]; i++) {
	// 		var picture = {
	// 			url: place.icon,
	// 			size: new google.maps.Size(71, 71),
	// 			origin: new google.maps.Point(0, 0),
	// 			anchor: new google.maps.Point(17, 34),
	// 			scaledSize: new google.maps.Size(25, 25)
	// 		};

	// 		var marker = new google.maps.Marker({
	// 			map: map,
	// 			icon: image,
	// 			title: place, name,
	// 			position: place.geometry.location
	// 		});

	// 		var li = document.createElement('li');
	// 		li.textContent = place.name;
	// 		placesList.appendChild(li); 

	// 		bounds.extend(place.geometry.location);
	// 	}
	// 	map.fitBounds(bounds);
	// }
})

// globally scoped variables
var eventLoc;
var datePicker;
var isClass = false;

function checkClass() {
	if (!isClass) {
		$('#eventDump').removeClass('smallEvents');
		isClass = true;
	} else {
		$('#eventDump').addClass('smallEvents');
		isClass = false;
	}
};
function emptyForm() {
	$('#location').val('');
	$('#datePicker').val('');
}
// function to scroll through the page cleanly based on 2 passed variables for where we want to go and how long
function scrollToFunction(destination, runTime) {
	// take the page location and store in variable
	var startingY = window.pageYOffset;
	// variable that compares where we are on the page to where we were
	var diff = destination - startingY;
	var start;
	window.requestAnimationFrame(function step(timestamp) {
		if (!start) start = timestamp;
		// Elapsed milliseconds since start of scrolling.
		var time = timestamp - start;
		// Get percent of completion in range [0, 1].
		var percent = Math.min(time / runTime, 1);
		// scroll to the point in the widnow
		window.scrollTo(0, startingY + diff * percent);
		// Proceed with animation as long as we wanted it to.
		if (time < runTime) {
			window.requestAnimationFrame(step);
		}
	})
}

function cardFactoryEvents(event) {
	// scroll to point of top of div
	scrollToFunction(400, 500);
	// variables to put data on the page
	var card = $('<div>').addClass('card event animated pulse');
	var cardBody = $('<div>').addClass('card-body');
	var cardFooter = $('<button>')
		.addClass('btn primary-color btn-lg btn-block')
		.text("Learn More About This Event");
	var cardTitle = $('<h5>').addClass("card-title");
	// making the card header
	// shortcut variables
	var performers = event.performers;
	var artist;
	// if there is a performers item
	if (performers) {
		// and if it is an array
		if (Array.isArray(performers.performer)) {
			// set variable artist to the first in the name
			artist = cardTitle.text(performers.performer[0].name);
			// if it's not an array, just use the performer name
		} else { artist = cardTitle.text(performers.performer.name); }
		// if it is blank, get the title of the event instead
	} else {
		artist = cardTitle.text(event.title);
	}
	// create an image that has our placeholder info in case there is no image on the call object.  Also create a placeholder variable
	var image;
	var tdImage = $('<img>').attr('src', './assets/images/placeholder.png').addClass("img-fluid");
	// if the image exists on the call
	if (event.image) {
		// set the placeholder to have info from the call
		image = event.image.medium;
		// update the tdImage accordingly
		tdImage = $('<img>')
			.attr("src", image.url)
			.attr("width", image.width)
			.attr("height", image.height)
			.addClass('img-fluid');
	};
	// Log the Start Time in a p class after formatting with moment.js
	var startingTime = moment(event.start_time).format("dddd, MMMM Do YYYY, h:mm a");
	var startTime = $('<p>').html(startingTime);
	// // log the venue name in a p class
	var venue = $('<p>').html(event.venue_name);
	// make a new button
	var selectEvent = $('<button>')
		.html("Select this event!")
		.addClass("selectEvent btn success-color-dark btn-lg btn-block")
		// give data attributes of lat and long to reference in the second API call later
		.attr("data-lat", event.latitude)
		.attr("data-long", event.longitude);
	// Build the footer out
	var url = event.url;
	var aLink = $('<a>')
		.attr("href", url)
		.attr("target", "_blank")
		.text("Learn More Here!");
	var tdURL = cardFooter.html(aLink);

	// build the body of the card
	cardBody.append(cardTitle, tdImage, venue, startTime, selectEvent, tdURL);
	// append the card with the body and
	card.html(cardBody)
	// append the right area with the new card
	$('#eventDump').append(card);
};
// build our loadGif item as a Row with the loading.gif in it
var loadGifDiv = $('<div>')
	.addClass("loadingGif")
	.html(
		$('<div>')
			.html(
				$('<img>')
					.attr('src', './assets/images/loading.gif')
					.addClass('whiteBG')
			));

// function to have a loading Gif
function loadingGif(div) {
	div.append(loadGifDiv);
}
// on load of the document
$(document).ready(function () {
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
	// Tooltips Initialization
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})
	//Bootstrap Calender Picker -- https://github.com/uxsolutions/bootstrap-datepicker//
	$('#sandbox-container .input-group.date').datepicker({
	});
	// end calender
	// add event listener to the btnStart
	$('#btnStart').on("click", function () {
		// keep it from submitting blank
		event.preventDefault();
		// add a loading gif
		$('#eventDump').empty();
		loadingGif($('#eventDump'));
		// save the information from the form in variables
		eventLoc = $('#location').val();
		datePicker = $('#datePicker').val();
		// item for running the API call
		var oArgs = {
			app_key: "dvq7JdvxVKZGZhLq",
			where: eventLoc,
			"date": datePicker,
			page_size: 12,
			sort_order: "popularity",
		}
		// the API call
		EVDB.API.call("/events/search", oArgs, function (oData) {
			// shortcut variable
			var eventArray = oData.events.event;
			console.log(eventArray);
			// run a for loop to get 12 objects on the page
			for (var i = 0; i < 12; i++) {
				if (i < 11) {
					// run the cardFactoryEvents function on eventArray at each iteration
					cardFactoryEvents(eventArray[i]);
					// on the last iteration remove the loadingGif
				} else {
					cardFactoryEvents(eventArray[i])
					$('.loadingGif').remove();
				}
			}
		});

	});
	// on click of the resetBtn
	$('#resetBtn').click(function () {
		emptyForm();
		scrollToFunction(0, 500);
		$('#eventDump').html('<a name="events"></a>')
	});
	// end of the page function
});



