function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });
}

// add model values
// tag to id of list
var list = document.getElementById("list");
for (var i=0;i<model.locations.length;i++) {
  // create li under the ul
  var newli = document.createElement("li");
  // append a new li to the ul
  list.appendChild(newli).innerHTML = model.locations[i].city + ", " + model.locations[i].country;

  console.log("hello");
}
