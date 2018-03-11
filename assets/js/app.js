////// ID's from html////////
// #startBox = row that hold The original input fields
// #location = location input search bar
// #bar = checkbox for bars
// #restaurant = checkbox for restaurants
// #datePicker = pickDate
// #eventDump = data from eventify api
// #mapDump = data from google places

//-------------------------------------//
// AutoComplete - Joe
var input = $('#location')[0];
var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
google.maps.event.addListener(autocomplete, 'place_changed', function () {
	var place = autocomplete.getPlace();
})
// End AutoComplete ADD

function initMap() {
	var map = new google.maps.Map(document.getElementById('mapDump'), {
		center: { lat: 40.7608, lng: -111.8910 },
		zoom: 13
	});
	var card = document.getElementById('pac-card');
	var input = document.getElementById('location');
	var bar = document.getElementById('bar');
	var restaurants = document.getElementById('restaurant');
	var strictBounds = document.getElementById('strict-bounds-selector');


	var autocomplete = new google.maps.places.Autocomplete(input);

	// Bind the map's bounds (viewport) property to the autocomplete object,
	// so that the autocomplete requests use the current map bounds for the
	// bounds option in the request.
	autocomplete.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
	var infowindowContent = document.getElementById('infowindow-content');
	infowindow.setContent(infowindowContent);
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function () {
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			window.alert("No details available for input: '" + place.name + "'");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);  // Why 17? Because it looks good.
		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		var address = '';
		if (place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		infowindowContent.children['place-icon'].src = place.icon;
		infowindowContent.children['place-name'].textContent = place.name;
		infowindowContent.children['place-address'].textContent = address;
		infowindow.open(map, marker);
	});

	// Sets a listener on a radio button to change the filter type on Places
	// Autocomplete.
	function setupClickListener(id, types) {
		var checkbox = document.getElementById(id);
		checkbox.addEventListener('click', function () {
			autocomplete.setTypes(types);
		});
	}

	setupClickListener('changetype-bar', ['bar']);
	setupClickListener('changetype-restaurant', ['restaurant']);

	document.getElementById('use-strict-bounds')
		.addEventListener('click', function () {
			console.log('Checkbox clicked! New state=' + this.checked);
			autocomplete.setOptions({ strictBounds: this.checked });
		});
}
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
function scrollToFunction(destination, runTime){
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
		.addClass("selectEvent btn success-color-dark btn-lg btn-block");
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
		// give data attributes of lat and long to reference in the second API call later
		.attr("data-lat", event.latitude)
		.attr("data-long", event.longitude);
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
$('#resetBtn').click(function(){
	emptyForm();
	scrollToFunction(0, 500);
});
	// end of the page function
});



