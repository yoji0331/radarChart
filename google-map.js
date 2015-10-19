/*jslint devel:true, browser:true */
/*global google, d3, radarChart, $ */

$(document).ready(function () {
    'use strict';
    var center = new google.maps.LatLng(40.7845, 140.778),
        options = {
            zoom: 15,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        map = new google.maps.Map($('#map').get(0), options),
        markers = [];

    function createMarker(spot, map) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(spot.lat, spot.lng),
            map: map
        });
        return marker;
    }

    function attachInfoWindow(marker) {
        var infoWindow;
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow = new google.maps.InfoWindow({
                content:　'<div id="infodiv"></div>'
            });
            infoWindow.open(marker.getMap(), marker);
            google.maps.event.addListener(infoWindow, 'domready', function () {
                radarChart();
            });
        });
    }

    $.getJSON("data.json", function (spots) {
        var i;
        for (i = 0; i < spots.length; i += 1) {
            markers[i] = createMarker(spots[i], map);
            attachInfoWindow(markers[i], spots[i].name);
        }
    });
});
