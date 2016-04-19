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

// object constructor for knockoutjs
function Location(data,i) {
  this.city = ko.observable(data.city);
  this.country = ko.observable(data.country);
  this.lat = ko.observable(data.lat);
  this.long = ko.observable(data.long);
  this.number = i;
  this.cityCountry = ko.computed(function() {
    return this.city() + ", " + this.country()
  }, this);
};


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
    var q = self.Query();
    return ko.utils.arrayFilter(self.locationsList(), function(i) {
      return i.cityCountry().toLowerCase().indexOf(q) >= 0;
    });
  });
};

ko.applyBindings(new ViewModel());
