// GOOGLE MAPS!

function initMap() {
  var myLatLng = {lat: model.locations[0].lat, lng: model.locations[0].long};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: myLatLng
  });

  // create a new infowindow variable
  var infowindow = new google.maps.InfoWindow();

  // create marker and i global variables
  var marker, i;

  for (i = 0; i < model.locations.length; i++) {
     marker = new google.maps.Marker({
       position: new google.maps.LatLng(model.locations[i].lat, model.locations[i].long),
       map: map
     });

     google.maps.event.addListener(marker, 'click', (function(marker, i) {
       return function() {
         // ADD CONTENT OF THE INFORMATION WINDOW
         var http = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ model.locations[i].city + ", " + model.locations[i].country + "&format=json";
         // PARSE JSON
         $.ajax({
          type: "GET",
          url: http,
          contentType: "application/json; charset=utf-8",
          async: false,
          dataType: "jsonp",
          success: function (data, textStatus, jqXHR) {
              console.log(data);
          },
          error: function (errorMessage) {
        }
    });

         infowindow.setContent("<h4>Wikipedia Results</h4>" +
         http
       );
         infowindow.open(map, marker);
         //ANIMATE MAP MARKERS WHEN CLICKED
         // use closure to have a separate variable for animation
         (function(markerClosure) {
           if (markerClosure.getAnimation() == null) {
             markerClosure.setAnimation(google.maps.Animation.BOUNCE);
           } else {
             markerClosure.setAnimation(null);
           }
         })(marker);
       }
     })(marker, i));
   }

   function toggleBounce() {

   }
}



// VIEW!
// tag to id of list
var list = document.getElementById("list");
for (var i=0;i<model.locations.length;i++) {
  // create li under the ul
  var newli = document.createElement("li");
  // append a new li to the ul
  list.appendChild(newli).innerHTML = model.locations[i].city + ", " + model.locations[i].country;
}
