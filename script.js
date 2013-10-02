var map, mgr;
var markers = [], markerArray = [];
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
    $('body').css('backgroundColor', '#dddddd');
    
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
    

    pano = null;
    google.maps.event.addListener(infowindow, 'domready', function() {
        if (pano != null) {
            pano.myContext.data.pov = pano.getPov();
            pano.myContext.data.svPosition = { lat : pano.getPosition().lat(), lng : pano.getPosition().lng()};
            pano.unbind("position");
            pano.setVisible(false);
        }
        var params = {
            addressControl : false,
            linksControl : false,
            panControl : false,
            scrollwheel : false,
            position: infowindow.myContext.data.svPosition? new google.maps.LatLng(infowindow.myContext.data.svPosition.lat, infowindow.myContext.data.svPosition.lng) : infowindow.myContext.marker.getPosition()
        };
        if (infowindow.myContext.data.pov) {
            params.pov = infowindow.myContext.data.pov;
        }
        pano = new google.maps.StreetViewPanorama(document.getElementById("content"), params);
        pano.myContext = infowindow.myContext;
        pano.setVisible(true);
    });

    google.maps.event.addListener(infowindow, 'closeclick', function() {
        infowindow.myContext.data.pov = pano.getPov();
        infowindow.myContext.data.svPosition = { lat : pano.getPosition().lat(), lng : pano.getPosition().lng()};
        pano.unbind("position");
        pano.setVisible(false);
        pano = null;
        $('#content').html('');
    });

    for (var i = 0; i < arr.length; i++) {
        (function(entry) {
            if (entry.lat && entry.lng) {
                var contentString = "<strong>" + entry.name + "</strong><br/>" + entry.address + "<br/>" + entry.description;
                var svString = "<div id='content' style='height: 150px; width: 300px;'></div>";
                var marker = new google.maps.Marker({
                    position : new google.maps.LatLng(entry.lat, entry.lng),
                    map : map,
                    title : entry.name,
                    icon : entry.icon,
                    draggable : true,
                    flat : true
                });
                
                var context = {
                    marker : marker,
                    data : entry
                };

                markers.push(context);
                markerArray.push(marker);
                
                google.maps.event.addListener(marker, 'click', function() {
                    $('#details').html(contentString);
                    infowindow.myContext = context;
                    infowindow.data = entry;
                    infowindow.setContent(contentString+svString);
                    infowindow.open(map,marker);
                });
                
                

            } else if (entry.address) {
                geocoder.geocode({
                    'address' : entry.address
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var contentString = "<strong>" + entry.name + "</strong><br/>" + entry.address + "<br/>" + entry.description;
                        var svString = "<div id='content' style='height: 150px; width: 300px;'></div>";
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
                        
                        var context = {
                            marker : marker,
                            data : entry
                        };
                        markers.push(context);
                        markerArray.push(marker);
                        google.maps.event.addListener(marker, 'click', function() {
                            $('#details').html(contentString);
                            infowindow.myContext = context;
                            infowindow.data = entry;
                            infowindow.setContent(contentString+svString);
                            infowindow.open(map,marker);
                        });
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
            }

        })(arr[i]);
    }
    
    mc = new MarkerClusterer(map, markerArray, {maxZoom: 14});
}

google.maps.event.addDomListener(window, 'load', initialize);