////// ID's from html////////
// #startBox = row that hold The original input fields
// #location = location input search bar
// #bar = checkbox for bars
// #restaurant = checkbox for restaurants
// #datePicker = pickDate
// #eventDump = data from eventify api
// #mapDump = data from google places

//-------------------------------------//
//Bootstrap Calender Picker -- https://github.com/uxsolutions/bootstrap-datepicker//
$('#sandbox-container .input-group.date').datepicker({
});
// end calender

function initMap() {
	var map = new google.maps.Map(document.getElementById('mapDump'), {
		center: { lat: 40.7608, lng: -111.8910 },
		zoom: 13
	});

	var input = document.getElementById('location');
	var bar = document.getElementById('bar');
	var restaurant = document.getElementById('restaurant');


	var autocomplete = new google.maps.places.Autocomplete(input);

	// Bind the map's bounds (viewport) property to the autocomplete object,
	// so that the autocomplete requests use the current map bounds for the
	// bounds option in the request.
	autocomplete.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
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
		var checkbox = document.getElementById();
		checkbox.addEventListener('click', function () {
			autocomplete.setTypes(types);
		});
	}

	setupClickListener('changetype-bar', ['bar']);
	setupClickListener('changetype-restaurant', ['restaurant']);

	// 	});
}
// globally scoped variables
var eventLoc;
var datePicker;

var modalTital = $('#modalTitle');

var displayEvents = $('#eventDump');

// variables to add to our card


// on load of the document
$(document).ready(function () {
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	 })
	 // Tooltips Initialization
	 $(function () {
		$('[data-toggle="tooltip"]').tooltip()
	 })

	var isClass = false;
	// add event listener to the btnStart
	$('#btnStart').on("click", function () {
		// keep it from submitting blank
		event.preventDefault();

$('#eventDump').empty();
if (isClass){
	$('#eventDump').removeClass(smallEvents)
	isClass = false;
}

		var card = $('<div>').addClass('card');
		var cardBody = $('<div>').addClass("card-body");
		var cardTitle = $('<h5>').addClass('card-title');

		var p9 = $('<p>').addClass('col-md-9');
		var newRow = $('<div>').addClass("row")
		// save the information in future variables
		eventLoc = $('#location').val();
		datePicker = $('#datePicker').val();
		// end function
		var oArgs = {
			app_key: "dvq7JdvxVKZGZhLq",
			where: eventLoc,
			"date": datePicker,
			page_size: 12,
			sort_order: "popularity",
		}
		EVDB.API.call("/events/search", oArgs, function (oData) {
			var eventArray = oData.events.event;
			console.log(eventArray);
			for (var i = 0; i < 12; i++) {
				var card = $('<div>').addClass('card event animated pulse');
				var cardBody = $('<div>').addClass('card-body');
				var cardFooter = $('<button>')
				.addClass('btn primary-color btn-lg btn-block')
				.text("Learn More About This Event");
				var cardTitle = $('<h5>').addClass("card-title");
				var eventArr = eventArray[i];
				;
				// making the card header
				// shortcut variable
				var performers = eventArr.performers;
				var artist;
				// if there are performers
				if (performers) {
					if (Array.isArray(performers.performer)) {
						artist = cardTitle.text(performers.performer[0].name);
					} else {
						artist = cardTitle.text(performers.performer.name)
							;
					}
				} else {
					artist = cardTitle.text(eventArr.title);
				}
				// building items in the row
				var newRow = $('<div>').addClass("row")
				// create an image
				var image;
				var tdImage = $('<img>').attr('src', './assets/images/placeholder.png').addClass("img-fluid");
				// if the image exists
				if (eventArr.image) {
					image = eventArr.image.medium;
					// give it attributes of an src and width
					tdImage = $('<img>')
						.attr("src", image.url)
						.attr("width", image.width)
						.attr("height", image.height)
						.addClass('img-fluid');
				};
				// Log the Start Time in a p class
				// var startingTime = moment(eventArr.start_time, "hh:mm A")
				// var startTime = $('<p>').html(startingTime);
				// console.log("Start time", startTime);
				// // log the venue name in a p class
				var venue = $('<p>').html(eventArr.venue_name);

			var selectEvent = $('<button>')
			.html("Select this event!")
			.addClass("selectEvent btn danger-color-dark btn-lg btn-block");
				// Build the footer out
				var url = eventArr.url;
				var aLink = $('<a>')
				.attr("href", url)
				.attr("parent", "blank")
				.text("Learn More Here!");
				var tdURL = cardFooter.html(aLink);

				// build the body of the card
				cardBody.append(cardTitle, tdImage, venue, selectEvent, tdURL);
				// append the card with the body and
				card.html(cardBody)
					// add a class of i so we reference specific card
					.attr("data-number", [i])
					// give data attributes of lat and long to reference in the second API call later
					.attr("data-lat", eventArr.latitude)
					.attr("data-long", eventArr.longitude);
				// append displayEvents with the new Row
				$('#eventDump').append(card);
			};
		});
		$('#formID').reset()[0];
	});

	$(document).on("click", ".selectEvent", function () {
		var longitude = $(this).parent().attr("data-long");
		var latitude = $(this).parent().attr("data-lat");
		console.log(longitude, latitude);

	})


	// end of the page function
});



