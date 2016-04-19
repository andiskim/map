var gmarkers = [];

// GOOGLE MAPS!
function initMap() {
  var myLatLng = {lat: model.locations[0].lat, lng: model.locations[0].long};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: myLatLng
  });

  // create a new infowindow variable
  var infowindow = new google.maps.InfoWindow();

  // create marker and i global variables
  var marker, i;

  for (i = 0; i < model.locations.length; i++) {
    // add marker but only show the ones that are shown on the list
     marker = new google.maps.Marker({
       position: new google.maps.LatLng(model.locations[i].lat, model.locations[i].long),
       map: map
     });

     google.maps.event.addListener(marker, 'click', (function(marker, i) {
       return function() {
         // ADD CONTENT OF THE INFORMATION WINDOW
         var http = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ model.locations[i].city + ", " + model.locations[i].country + "&format=json";
         var wikiContent = "";
         // PARSE JSON AND ADD DATA
           $.ajax({
              type: "GET",
              url: http,
              contentType: "application/json; charset=utf-8",
              async: false,
              dataType: "jsonp",
              success: function (data, textStatus, jqXHR) {
                for(var j=0; j < data[1].length; j++) {
                  wikiContent += "<li>" + (j+1).toString()+": "+ "<a href='" + data[3][j]+ "'>" + data[1][j] + "</a></li>";
                }
                // open window after loading data
                infowindow.setContent("<h4>Wikipedia Results for "+ model.locations[i].city+", "+ model.locations[i].country +"</h4>" + wikiContent);
                infowindow.open(map, marker);
              },
              error: function (errorMessage) {
              },
              async: false
          });

         //ANIMATE MAP MARKERS WHEN CLICKED
         // use closure to have a separate variable for animation
         (function(markerClosure) {
            // bounce animation
            markerClosure.setAnimation(google.maps.Animation.BOUNCE);
            // stop bounce after 1400ms
            setTimeout(function(){ markerClosure.setAnimation(null); }, 1400);
         })(marker);
       }
     })(marker, i));

     //add link to marker
     gmarkers.push(marker);
   }
}



// VIEW!
// tag to id of list
// for (var i=0;i<model.locations.length;i++) {
//   // create li under the ul and link to Google Maps
//   var cityAndCountry = model.locations[i].city + ", " + model.locations[i].country;
//   var link = '<a href="javascript:google.maps.event.trigger(gmarkers[' + i.toString() + '],'+ "'click'" + ');">' + cityAndCountry + '</a>';
//   $("#locationItem").append(link);
//   // console.log(link);
// }
