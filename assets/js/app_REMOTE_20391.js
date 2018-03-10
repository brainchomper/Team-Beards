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

// // AutoComplete - Joe
// var input = $('#location')[0];
// var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
// google.maps.event.addListener(autocomplete, 'place_changed', function () {
// 	var place = autocomplete.getPlace();
// })
// // End AutoComplete ADD

function initMap() {
  var map = new google.maps.Map(document.getElementById('mapDump'), {
    center: {lat: 40.7608, lng: -111.8910},
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

  autocomplete.addListener('place_changed', function() {
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
    checkbox.addEventListener('click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-bar', ['bar']);
  setupClickListener('changetype-restaurant', ['restaurant']);

  document.getElementById('use-strict-bounds')
      .addEventListener('click', function() {
        console.log('Checkbox clicked! New state=' + this.checked);
        autocomplete.setOptions({strictBounds: this.checked});
      });
}

// globally scoped variables
var eventLoc;
var datePicker;

var modalTital = $('#modalTitle');

var displayEvents = $('#eventDump');

// variables to add to our card


// on load of the document
$(document).ready(function () {

	// add event listener to the btnStart
	$('#btnStart').on("click", function () {
		// keep it from submitting blank
		event.preventDefault();

		var card = $('<div>').addClass('card');
		var cardBody = $('<div>').addClass("card-body");
		var cardTitle = $('<h5>').addClass('card-title');
		var cardFooter = $("<div>").addClass("card-footer");

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
			page_size: 10,
			sort_order: "popularity",
		}
		EVDB.API.call("/events/search", oArgs, function (oData) {
			var eventArray = oData.events.event;
			console.log(oData);
			for (var i = 0; i < eventArray.length; i++) {
				var eventArr = eventArray[i];
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
				// create an image
				var image;
				var tdImage = $('<p>').text("No Image Available");
				// if the image exists
				if (eventArr.image) {
					image = eventArr.image.medium;
					console.log(image);
					// give it attributes of an src and width
					tdImage = $('<img>')
						.attr("src", image.url)
						.attr("width", image.width)
						.attr("height", image.height)
						.addClass('img-fluid');
				};
				// Log the Start Time in a p class
				var startTime = p9.text(eventArr.startTime);
				// log the venue name in a p class
				var venue = p9.text(eventArr.venue_name);
				console.log("venue name", eventArr.venue_name);

				// Build a row from the row items of image start time and venue name
				newRow.append(image, startTime, venue);

				// Build the footer out
				var url = eventArr.url;
				var aLink = $('<a>').attr("href", url).text("Learn More Here!");
				var tdURL = cardFooter.html(aLink);

				// build the body of the card
				cardBody.append(cardTitle, newRow, tdURL);
				// append the card with the body and
				card.append(cardBody)
					// add a class of i so we reference specific card
					.attr("data-number", [i])
					// give data attributes of lat and long to reference in the second API call later
					.attr("data-lat", eventArr.latitude)
					.attr("data-long", eventArr.longitude);
				// append displayEvents with the new Row
				displayEvents.append(card);
			}
		})

	});

	// end of the page function
});

