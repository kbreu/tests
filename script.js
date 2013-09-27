var map, mgr;
var markers = [];
var geocoder;

google.maps.visualRefresh = true;

function saveMarkerPositions() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].data.lat = markers[i].marker.getPosition().lat();
        markers[i].data.lng = markers[i].marker.getPosition().lng();
    }

    console.log(JSON.stringify(arr));
}

function initialize() {
    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        labels : false,
        zoom : 16,
        center : new google.maps.LatLng(52.506022, 13.463058),
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Kirchen
    // Cafes
    // Restaurants
    // Icons
    // Detailzone bei Klick
    // Tankstellen
    // Geldautomaten
    // Kioske
    
    var infowindow = new google.maps.InfoWindow({
        content : ""
    });

    for (var i = 0; i < arr.length; i++) {
        (function(entry) {
            if (entry.lat && entry.lng) {
                var contentString = "<strong>" + entry.name + "</strong><br/>" + entry.address + "<br/>" + entry.description;
                
                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(entry.lat, entry.lng),
                    map : map,
                    title : entry.name,
                    icon : entry.icon,
                    draggable : true,
                    flat : true
                });
                

                markers.push({
                    marker : marker,
                    data : entry
                });
                google.maps.event.addListener(marker, 'click', function() {
                    $('#details').html(contentString);
                    infowindow.setContent(contentString);
                    infowindow.open(map,marker);

                });

            } else if (entry.address) {
                geocoder.geocode({
                    'address' : entry.address
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var marker = new google.maps.Marker({
                            position : results[0].geometry.location,
                            icon : entry.icon,
                            map : map,
                            title : entry.name,
                            draggable : true,
                            flat : true
                        });
                        entry.lat = results[0].geometry.location.lat();
                        entry.lng = results[0].geometry.location.lng();
                        markers.push({
                            marker : marker,
                            data : entry
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                            $('#details').html(entry.name + "<br/>" + entry.address + "<br/>" + entry.description);
                        });
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
            }

        })(arr[i]);
    }
}

google.maps.event.addDomListener(window, 'load', initialize);