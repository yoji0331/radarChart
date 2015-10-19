/*global google, $, window, d3 */
/*jslint browser:true, devel:true, this:true */

var radarChart = function () {
    'use strict';
    var w = 200;
    var h = 200;
    var padding = 20;
    var svg = d3.select('#infodiv')
        .append('svg')
        .attr('width', w)
        .attr('height', h);
    var dataset = [
        [5, 5, 2, 5, 8, 2, 3],
        [2, 1, 5, 2, 5, 6, 7]
    ];
    var paramCount = dataset[0].length;
    var max = d3.max(d3.merge(dataset));
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
