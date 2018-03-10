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

// AutoComplete - Joe
var input = $('#location')[0];
var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
google.maps.event.addListener(autocomplete, 'place_changed', function () {
	var place = autocomplete.getPlace();
})
// End AutoComplete ADD



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
$('#eventDump').empty();
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
				var card = $('<div>').addClass('card event');
				var cardBody = $('<div>').addClass('card-body');
				var cardFooter = $('<div>').addClass('card-footer');
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
				var tdImage = $('<p>').text("No Image Available");
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
			
				// Build the footer out
				var url = eventArr.url;
				var aLink = $('<a>').attr("href", url).text("Learn More Here!");
				var tdURL = cardFooter.html(aLink);

				// build the body of the card
				cardBody.append(cardTitle, tdImage, venue, tdURL);
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
	});
	// end of the page function
});

