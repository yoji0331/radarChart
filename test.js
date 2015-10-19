/*global google, $, window, d3 */
/*jslint browser:true, devel:true, this:true */
/*global google, d3, radarChart, $ */

var blank_scores = [];

var center,
    options,
    map,
    markers;

function createMarker(spot, map) {
    'use strict';
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(spot.lat, spot.lng),
        map: map
    });
    return marker;
}

var radarChart = function (scores) {
    'use strict';
    var w = 200;
    var h = 200;
    var padding = 20;
    var svg = d3.select('#infodiv')
        .append('svg')
        .attr('width', w)
        .attr('height', h);
    var dataset = scores;
    var paramCount = dataset.length;
    var max = d3.max(dataset);
    var rScale = d3.scale.linear()
        .domain([0, max])
        .range([0, w / 2 - padding]);
    var grid = function () {
        var result = [];
        var i, j, arr;
        for (i = 1; i <= max; i += 1) {
            arr = [];
            for (j = 0; j < paramCount; j += 1) {
                arr.push(i);
            }
            result.push(arr);
        }
        return result;
    };
    grid();
    var label = function () {
        var result = [];
        var i;
        for (i = 0; i < paramCount; i += 1) {
            result.push(max + 1);
        }
        return result;
    };
    label();
    var line = d3.svg.line()
        .x(function (d, i) {
            return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .y(function (d, i) {
            return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .interpolate('linear');

    svg.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('d', function (d) {
            return line(d) + "z";
        })
        .attr("stroke", function (d, i) {
            return d3.scale.category10().range()[i];
        })
        .attr("stroke-width", 2)
        .attr('fill', 'none');
    svg.selectAll("path.grid")
        .data(grid)
        .enter()
        .append("path")
        .attr("d", function (d, i) {
            return line(d) + "z";
        })
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2")
        .attr('fill', 'none');
    svg.selectAll("text")
        .data(label)
        .enter()
        .append('text')
        .text(function (d, i) {
            return i + 1;
        })
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr('x', function (d, i) {
            return rScale(d) * Math.cos(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .attr('y', function (d, i) {
            return rScale(d) * Math.sin(2 * Math.PI / paramCount * i - (Math.PI / 2)) + w / 2;
        })
        .attr("font-size", "15px");
};

function attachInfoWindow(marker, name, blank_scores) {
    'use strict';
    var infoWindow;
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow = new google.maps.InfoWindow({
            content:　name + '<div id="infodiv"></div>'
        });
        infoWindow.open(marker.getMap(), marker);
        google.maps.event.addListener(infoWindow, 'domready', function () {
            radarChart(blank_scores);
        });
    });
}

$(document).ready(function () {
    'use strict';
    center = new google.maps.LatLng(40.7845, 140.778);
    options = {
        zoom: 15,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($('#map').get(0), options);
    markers = [];

    $.getJSON("data.json", function (spots) {
        var i;
        for (i = 0; i < spots.length; i += 1) {
            blank_scores = spots[i].scores;
            markers[i] = createMarker(spots[i], map);
            attachInfoWindow(markers[i], spots[i].name, blank_scores);
        }
    });
});
