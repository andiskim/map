'use strict';
// data
var model = {
  locations: [
    {
      city: "Madrid",
      country: "Spain",
      lat: 40.4378693,
      long: -3.8199645
    },
    {
      city: "Bogota",
      country: "Colombia",
      lat: 3.1699298,
      long: -76.0765486
    },
    {
      city: "Almaty",
      country: "Kazakhstan",
      lat: 43.1684119,
      long: 74.6190092
    },
    {
      city: "Budapest",
      country: "Hungary",
      lat: 47.4580173,
      long: 18.265469
    },
    {
      city: "Warsaw",
      country: "Poland",
      lat: 52.2215236,
      long: 20.0824175
    }
  ]
};




// OBJECT CONSTRUCTOR FOR LOCATION
function Location($data,i) {
  var marker;

  this.city = ko.observable($data.city);
  this.country = ko.observable($data.country);
  this.lat = ko.observable($data.lat);
  this.long = ko.observable($data.long);
  this.number = i;
  this.cityCountry = ko.computed(function() {
    return this.city() + ", " + this.country();
  }, this);

  // ADD NEW PIN
  marker = new google.maps.Marker({
    position: new google.maps.LatLng($data.lat, $data.long),
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP
  });

  // GOOGLE MAPS LISTENER
  google.maps.event.addListener(marker, 'click', (function(marker) {
    return function() {
      // ADD CONTENT OF THE INFORMATION WINDOW
      var http = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+
      $data.city + ", " + $data.country + "&format=json";
      var wikiContent = "";

      self.apiTimeout = setTimeout(function() {
              alert('ERROR: Failed to load data');
            }, 5000);

    self.apiTimeout;
      // PARSE JSON AND ADD DATA
        $.ajax({
           type: "GET",
           url: http,
           contentType: "application/json; charset=utf-8",
           async: true,
           dataType: "jsonp",

       }).done(function (data, textStatus, jqXHR) {
         for(var j=0; j < data[1].length; j++) {
           wikiContent += "<li>" + (j+1).toString()+": "+ "<a href='" +
           data[3][j]+ "'" + " target=" + '"_blank"'+ ">" + data[1][j] + "</a></li>";
         }
         // open window after loading data
         infowindow.setContent("<h4>Wikipedia Results for "+ $data.city+", "+
         $data.country +"</h4>" + wikiContent);
         infowindow.open(map, marker);

         clearTimeout(self.apiTimeout);
       }).fail(function() {
         alert("Wikipedia API Failed");
       });

       //ANIMATE MAP MARKERS WHEN CLICKED
       // use closure to have a separate variable for animation
       (function(markerClosure) {
          // bounce animation
          markerClosure.setAnimation(google.maps.Animation.BOUNCE);
          // stop bounce after 1400ms
          setTimeout(function(){ markerClosure.setAnimation(null); }, 1400);
       })(marker);
     };
   })(marker));

   //add to gmarkers
   gmarkers.push(marker);

  // HIDING PINS
  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);
}

//knockoutjs ViewModel to utilize model data and object constructor function
function ViewModel() {
  var self = this;

  //create new observable Array
  this.locationsList = ko.observableArray([]);

  // loop through and populate observable Array
  for (var i = 0; i < model.locations.length; i++) {
    self.locationsList.push(new Location(model.locations[i], i));
  }

  // set current location
  // this.currentLocation = ko.observable(this.locationsList()[0]);

  // create observable to store input data for filtering
  this.Query = ko.observable('');

  // use the query in the view to filter
  this.searchResults = ko.computed(function() {
    var q = self.Query().toLowerCase();
    return ko.utils.arrayFilter(self.locationsList(), function(item) {
      var match = item.cityCountry().toLowerCase().indexOf(q) >= 0;

      item.isVisible(match);
      return match;

    });
  });
}

// INITIALIZE GOOGLE MAP
var gmarkers = [];

var myLatLng = {lat: model.locations[0].lat, lng: model.locations[0].long};
var map, infowindow;


function initMap() {


  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: myLatLng
  });

  infowindow = new google.maps.InfoWindow();

  ko.applyBindings(new ViewModel());
}
