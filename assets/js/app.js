////// ID's from html////////
// #startBox = row that hold The original input fields
// #location = location input search bar
// #bar = checkbox for bars
// #restaurant = checkbox for restaurants
// #datePicker = pickDate
// #eventDump = data from eventify api
// #mapDump = data from google places

//-------------------------------------//
// globally scoped variables
var eventLoc;
var datePicker;
var classCheck = false;
var barCheck = false;
var restCheck = false;
var map;

// on load of the document
$(document).ready(function () {
	$('#mapDump').hide();
	$('#crapDump').hide();
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
		if (classCheck) {
			$('#eventDump').removeClass('smallEvents');
			classCheck = false;
		}
		// check box listener for api call
		if ($('#bar').prop('checked')) {
			barCheck = true;
		};
		if ($('#restaurant').prop('checked')) {
			restCheck = true;
		};
		// end checkbox listener
		// data validation for lacation and datepicker
		var valiDate = $('#datePicker').val();
		var valiLocate = $('#location').val();
		if (valiLocate === '') {
		} else if (valiDate === '') {
		} else {
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
		}
	});

	function emptyForm() {
		$('#location').val('');
		$('#datePicker').val('');
	}

	// on click of the resetBtn
	$('#resetBtn').click(function () {
		emptyForm();
		scrollToFunction(0, 500);
		$('#eventDump').html('<a name="events"></a>')
		$('#placeDump').html('');
		$('#mapDump').hide();
		$('#crapDump').hide();
		$('#restaurant').prop("checked", false);
		$('#bar').prop("checked", false);
		if (classCheck) {
			$('#eventDump').removeClass('smallEvents');
			classCheck = false;
		}
	});

});

// // AutoComplete Location Search
function activatePlacesSearch() {
	var input = document.getElementById('location');
	var autocomplete = new google.maps.places.Autocomplete(input);
}
// End AutoComplete 

//Event Select Function//
$(document).on("click", ".selectEvent", function () {
	$('#mapDump').show();
	$('#crapDump').show();
	$('#placeDump').empty();
	// add the small events class if not present
	if (!classCheck) {
		$('#eventDump').addClass('smallEvents')
		classCheck = true;
	}
	// scroll us to the location
	scrollToFunction(700, 1000)
	if (barCheck && restCheck) {
		$('#cHeader').text('Bars & Restaurants Near Your Event')
		googleAPICall($(this), 'bar', 6);
		googleAPICall($(this), 'restaurant', 6)
	} else if (barCheck) {
		$('#cHeader').text('Bars Near Your Event')
		googleAPICall($(this), 'bar', 12)
	} else {
		googleAPICall($(this), 'restaurant', 12)
	}
});

//Card Factory//
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
	var startingTime = moment(event.start_time).format("MMMM Do YYYY, h:mm:ss a");
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
// build out the places
function cardFactoryPlaces(event) {
	// variables to put data on the page
	var card = $('<div>').addClass('card event animated pulse');
	var cardBody = $('<div>').addClass('card-body');
	var cardTitle = $('<h5>').addClass("card-title");
	var cardFooter = $('<button>')
		.addClass('btn primary-color btn-lg btn-block')
		.text("Learn More About This Event");
	// grab info from the api call on the iteration
	cardTitle.html(event.name)
	var rating = $('<p>').text("Rating: " + event.rating);
	var searchButton = $('<button>')
		.text("Learn More Here")
		.addClass("btn primary-color btn-lg btn-block");
	var queryURL = $('<a>')
		.attr("href", ("https://maps.google.com/?q=" + event.name))
		.attr("target", "_blank")
		.html(searchButton);
	// get the cost as a number then check it to update the div
	var cost = parseInt(event.price_level);
	var printCost;
	if (cost === 3) { printCost = $('<p>').text('Price Range: $$$') }
	else if (cost === 2) { printCost = $('<p>').text('Price Range: $$') }
	else if (cost === 1) { printCost = $('<p>').text('Price Range: $') }
	else { printCost = $('<p>').text('Price Range Unavailable') }
	var placeAddress = $('<p>').text(event.vicinity);

	// append cardBody with the info we're looking at
	cardBody.append(cardTitle, placeAddress, rating, printCost, queryURL);

	card.append(cardBody);
	$('#placeDump').append(card);
}

// function to have a loading Gif
function loadingGif(div) {
	div.append(loadGifDiv);
}

//Bar and Restaurant Card Factory //
//to be added to page when select event is chosen//
//also adds map to mapDump//
// API call based on an event, searchTerm and how many times you want it to append to the page
function googleAPICall(event, searchTerm, loops) {
	var longitude = event.attr("data-long");
	var latitude = event.attr("data-lat");
	var lat = parseFloat(latitude);
	var lng = parseFloat(longitude);
	// Create the map
	var startLoc = { lat, lng };
	map = new google.maps.Map(document.getElementById('mapDump'), {
		center: startLoc,
		zoom: 17
	});

	//Create the places service
	var service = new google.maps.places.PlacesService(map);
	var searchResults;
	// Perform a nearby search
	service.nearbySearch(
		{ location: startLoc, radius: 1500, type: [searchTerm] },
		function (results, status, pagination) {
			if (status !== 'OK') return;
			searchResults = results;
			for (var i = 0; i < loops; i++) {
				if (i < loops) {
					cardFactoryPlaces(searchResults[i]);
				} else {
					cardFactoryPlaces(searchResults[i])
					$('.loadingGif').remove();
				}
			}
		})
};

// function to scroll through the page cleanly 
//based on 2 passed variables for where we want to go and how long
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




