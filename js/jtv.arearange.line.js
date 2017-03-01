/*
 * Area range and line chart using d3.js
 * By JunctionTV Inc
 */
(function () {
    var jtvd3 = window.jtvd3 = {};
    jtvd3.tooltip = jtvd3.tooltip || {};
    jtvd3.legend = jtvd3.legend || {};
    jtvd3.lineChart = jtvd3.lineChart || {};
    jtvd3.chart = jtvd3.chart || {};
    jtvd3.component = jtvd3.component || {};
    jtvd3.utility = jtvd3.utility || {};

    jtvd3.component.drawLineChart = function (container, retdata, options) {
        var margin = {top: 50, right: 40, bottom: 60, left: 50};
        
        var offsetHeight = document.getElementById(container).offsetHeight,
            offsetWidth = document.getElementById(container).offsetWidth,
            height = offsetHeight,
            width = offsetWidth - 120,
        
            defaultChartOpt = {
                axes : {
                    xLabel : "Date",
                    yLabel : "Count",
                    yAxisLabelPos : "outer",//inner will set the Y axis label position in inner side,
                    xScale : "datetime1" //For date time in X axis, provide 'datetime'
                },
                lineOpt : {
                    strokeWidth : 2,
                    areaOpacity : 0.5,
                    interpolate : "cardinal"//Different shape of the line and area(i.e linear, cardinal, monotone etc)
                },
                legend : {
                    enable : true,
                    legendType : 'circle'
                },
                background : {
                    bgColor : "#FFF",
                    gridlineWidth : 0.2,
                    noofGrids : 10
                }
            },
            chartOpt = jtvd3.utility.extendDefaults(defaultChartOpt, options);
        
        var parseDate = d3.time.format("%Y%m%d").parse;
        var timeFormat = d3.time.format('%b %d');
        
        var data = retdata;

        //ASSIGNING LINE COLORS
        var linecolor = d3.scale.category10();
        //ASSIGNING AREA COLORS
        var areacolor = jtvd3.utility.getColor(["#ffe4cc", "#c3efc3", "#f3bfbe"]);//["#ffe4cc", "#c3efc3"]

        //DEFINING X-AXIS RANGE
        if(chartOpt.axes.xScale === 'datetime'){
            var x = d3.time.scale()
                    .range([0, width]);
        }else{
            var x = d3.scale.ordinal()
                .range([0, width]);
        }

        //DEFINING Y-AXIS RANGE
        var y = d3.scale.linear()
                .range([height, 0]);

        //DEFINING X-AXIS SCALE
        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

        //DEFINING Y-AXIS SCALE
        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

        //DEFINING LINE
        var line = d3.svg.line()
                .interpolate(chartOpt.lineOpt.interpolate)
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.avg);
                });

        //DEFINING AREA
        var area = d3.svg.area()
                .interpolate(chartOpt.lineOpt.interpolate)
                .x(function (d) {
                    return x(d.date);
                })
                .y0(function (d) {
                    return y(d.low);
                })
                .y1(function (d) {
                    return y(d.high);
                });

        //PREPARING SVG      
//        var svg = d3.select("body").append("svg")
        var svg = d3.select("#" + container).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var jtvd3contG = svg.append("g")
                .attr("class", "jtvd3-content-g");

        //CREATING BACKGROUND
        var jtvd3background = jtvd3contG.append("g")
                .attr("class", "jtvd3-chart-background");
        jtvd3background.append("svg:rect")  // Grid lines Bakcground
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width)
                .attr("fill", chartOpt.background.bgColor)
                .style("opacity", "0.3");
        //->CREATING Y GRID IN BACKGROUND
        jtvd3background.append("g")     // Draw the y Grid lines
                .attr("class", "grid")
                .style("stroke-width", chartOpt.background.gridlineWidth)
                .call(make_y_axis()
                        .tickSize(-width, 0, 0)
                        .tickFormat("")
                        );

        //PREPARING DATA
        
        //ASSIGN COLOR TO LABEL
        linecolor.domain(data.map(function (d) {
            return d.label;
        }));
        //ASSIGNING KEY AND VALUES
        data.forEach(function (kv) {
            var labelName = kv.key;
            kv.values.forEach(function (d) {

                d.date = parseDate(d.date) ? parseDate(d.date) : d.date;
                d.low = +d.low;
                d.high = +d.high;
                d.avg = +d.avg;
                d.label = labelName;
            });
        });
        function make_y_axis() {    // function for the y grid lines
            return d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(chartOpt.background.noofGrids)
        }

        var minLow = d3.min(data, function (kv) {
            return d3.min(kv.values, function (d) {
                return d.low;
            });
        });
        var maxHigh = d3.max(data, function (kv) {
            return d3.max(kv.values, function (d) {
                return d.high;
            });
        });

        //DEFINING X AND Y DOMAINS
        if(chartOpt.axes.xScale === 'datetime'){
            x.domain(d3.extent(data[0].values.map(function (d) {
                return d.date;
            })));
        }else{
            x.domain(data[0].values.map(function (d) {
                return d.date;
            })).rangePoints([0, width]);
        }
        y.domain([0, maxHigh]);
        
        //SET NO OF Y GRIDS
        noofgrids = maxHigh;
        
        //PLOT X-AXIS
        svg.append("g")
                .attr("class", "x axis")
                .call(xAxis)
                .attr("transform", "translate(0," + height + ")")
                .append("text")
                .attr("x", 50 * 8)//POSITIONING X AXIS TEXT
                .attr("dx", ".81em")//POSITIONING X AXIS TEXT
                .attr("y", 30)//POSITIONING X AXIS TEXT
                .attr("dy", ".71em")//POSITIONING X AXIS TEXT
                .style("text-anchor", "end")
                .text(chartOpt.axes.xLabel);

        //PLOT Y-AXIS
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", function(){
                    if(chartOpt.axes.yAxisLabelPos == 'outer')
                        return (-6 * 7)
                    else
                        return 6;
                })
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(chartOpt.axes.yLabel);

        //DRAWING AREA GROUP
        var jtvd3areagrp = jtvd3contG.append("g")
                .attr("class", "jtvd3-area-grp");
        var garea = jtvd3areagrp.selectAll(".garea")
                .data(data)
                .enter().append("g")
                .attr("class", "garea");

        //DRAWING AREA
        var parea = garea.append("path")
                .data(data)
                .attr("class", "jtvd3-area")
                .attr("id", function (d, i) {
                    return "jtvd3-area-" + container + "-" + i;
                })
                //.attr("d", area);
                .attr("d", function (d, i) {
                    return area(d.values);
                })
                .style("fill", function (d, i) {
                    return areacolor(i);
                })
                .style("opacity", chartOpt.lineOpt.areaOpacity);

        //DRAWING LINE GROUP
        var jtvd3linegrp = jtvd3contG.append("g")
                .attr("class", "jtvd3-gline-grp");
        var gline = jtvd3linegrp.selectAll(".gline")
                .data(data)
                .enter().append("g")
                .attr("class", "gline");
        //DRAWING LINE
        var p = gline.append("path")
                .data(data)
                .attr("class", "jtv3-line")
                .attr("id", function (d, i) {
                    return "line-" + container + "-" + i;
                })
                //.attr("d", line);
                .attr("d", function (d, i) {
                    //console.log(d.values)
                    return line(d.values);
                })
                .style("stroke", function (d) {
                    return linecolor(d.key);
                })
                .style("fill", "none")
                .style("stroke-width", chartOpt.lineOpt.strokeWidth);

        //DRAWING DOT GROUP
        var jtvd3dotgrp = jtvd3contG.append("g")
                .attr("class", "jtvd3-dot-grp");

        //DRAWING DOTS
        jtvd3dotgrp.selectAll("g.dot")
                .data(data)
                .enter().append("g")
                .attr("class", "dot")
                .attr("id", function (d, i) {
                    return "linedot-" + container + "-" + i;
                })
                .selectAll("circle")
                .data(function (d) {
                    return d.values;
                })
                .enter().append("circle")
                .attr("r", 3)
                .style("fill", function (d) {
                    return linecolor(d.label);
                })
                .style("stroke", function (d) {
                    return linecolor(d.label);
                })
                .attr("cx", function (d, i) {
                    return x(d.date);
                })
                .attr("cy", function (d, i) {
                    return y(d.avg);
                });


        //TOOLTIP STARTS HERE
        // Define 'div' for tooltips
        var tpCont = {};
        var div = d3.select('#' + container).append("div") // declare the properties for the div used for the tooltips
                .attr("class", "jtvd3-tooltip")       // apply the 'tooltip' class
                .attr("id", "tooltip-" + container)       // apply the 'tooltip' id
                .style("opacity", 0);
        
        var jtvd3dotgrp = jtvd3contG.append("g")
                .attr("class", "jtvd3-dot-grp");
            jtvd3dotgrp.selectAll("g.dot")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "dot")
                    .attr("id", function(d, i){
                        return "linedot-"+container+"-"+i;
                    })
                    .selectAll("circle")
                    .data(function (d) {
                        return d.values;
                    })
                    .enter().append("circle")
                    .attr("r", 3)
                    .style("fill", function (d) {
                        return linecolor(d.label);
                    })
                    .style("opacity", 0)
                    .style("stroke", function (d) {
                        return linecolor(d.label);
                    })
                    .attr("cx", function (d, i) {
                    return x(d.date);
                    })
                    .attr("cy", function (d, i) {
                        return y(d.avg);
                    })

                    .on("mouseover", function (d) {              // when the mouse goes over a circle, do the following
                        div.transition()                  // declare the transition properties to bring fade-in div
                                .duration(200)                  // it shall take 200ms
                                .style("opacity", .9);           // and go all the way to an opacity of .9
                        
                        tpCont.high = d.high, tpCont.avg = d.avg, tpCont.low = d.low;
                        
                        var ttpHead = (chartOpt.axes.xScale === 'datetime') ? timeFormat(d.date) : d.date;//If xscale in time format
                        
                        var jtvtooltipDv = jtvd3.tooltip.single(ttpHead, linecolor(d.label), d, tpCont, true);
                        div.html(jtvtooltipDv)  // add the text of the tooltip as html 
                                    .style("left", function(){
                                        return x(d.date) + 20 + "px";
                                    })     // move it in the x direction 
                                    .style("top", function(){
                                        return y(d.avg) + 20 + "px";
                                    });  // move it in the y direction
                        document.getElementsByClassName("jtvd3-tooltip")[0].style.border = "1px solid "+linecolor(d.label);

                    })
                    .on("mouseout", function (d) {             // when the mouse leaves a circle, do the following
                        div.transition()                  // declare the transition properties to fade-out the div
                                .duration(500)                  // it shall take 500ms
                                .style("opacity", 0);             // and go all the way to an opacity of nil
                    });
            if(chartOpt.legend.enable){   
                //CREATE LEGEND GROUP
                var jtvd3legendgrp = jtvd3contG.append("g")
                        .attr("class", "jtvd3-legend-grp");
                var jtvline = {};  
                var legend = jtvd3legendgrp.selectAll().append("g")
                           .data(data)
                           .enter().append('g')

                           .attr('id', function(d, i){
                               return "legend-"+container+"-"+i;
                           })
                           .attr('class', 'legend')
                           .on("click", function(d, i){
                                   // Determine if current line is visible
                                   var active   = jtvline.active ? false : true ,
                                     newOpacity = active ? 0 : 1,
                                     newLegendfill = active ? '#fff' : linecolor(d.key),
                                     areaStroke = active ? 'none' : areacolor(i);
                                   // Hide or show the elements
                                   d3.select("#line-"+container+"-"+i).attr("opacity", newOpacity);
                                   d3.select("#linedot-"+container+"-"+i).style("opacity", newOpacity);
                                   d3.select("#circle-legend-"+container+"-"+i).style("fill", newLegendfill);
                                   d3.select("#rect-legend-"+container+"-"+i).style("fill", newLegendfill);
                                   d3.select("#jtvd3-area-"+container+"-"+i).style("fill", areaStroke);
                                   d3.select("#linedot-"+container+"-"+i).selectAll("circle").attr("opacity", newOpacity);

                                   jtvline.active = active;

                           });
                legend.attr("transform", function (d, i) {
                            //return "translate(-" + ((width - (width / 2)) - (i * 90)) + ", -" + ((i+1) * 20) + ")";
                            return "translate(" + (((width / 4) - (width / 3)) - (i * 120)) + ", -" + ((i+1) * 20) + ")";
                        });
                if(chartOpt.legend.legendType === 'circle'){
                    legend.append('circle')
                        .style('stroke', function (d) {
                            return linecolor(d.key);
                        })
                        .style('stroke-width', 2)
                        .attr('class','circle-legend')
                        .attr('id', function(d, i){
                            return "circle-legend-"+container+"-"+i;
                        })
                        .attr("r", 5)
                        .attr('cx', width - 20)
                        .attr('cy', function (d, i) {
                            return i * 20;
                        })
                        .style('fill', function (d) {
                            return linecolor(d.key);
                        });
                }else{
                    legend.append('rect')
                            .attr('x', width - 20)
                            .attr('y', function (d, i) {
                                return (i * 20)-5;
                            })
                            .attr("r", 5)
                            .attr('width', 10)
                            .attr('height', 10)
                            .attr('id', function(d, i){
                                return "rect-legend-"+container+"-"+i;
                            })
                            .style('fill', function (d) {
                                return linecolor(d.key);
                            })
                            .style('stroke', function (d) {
                                return linecolor(d.key);
                            });
                }
                legend.append('text')
                        .attr('x', width - 8)
                        .attr('y', function (d, i) {
                            return (i * 20) + 5;
                        })
                        .text(function (d) {
                            return d.key;
                        });
        }
        d3.select(window).on('resize', resizeChart);
        function resizeChart(){
            jtvd3.component.drawLineChart(container, data, options)
        }
    };
    jtvd3.tooltip.single = function(heading, color, value,tpCont, tlptype){
        var div = [];
        div.push('<div class="jtvd3-iiner-tip">');
            div.push('<div class="tooltip-heading"><b>' + value.label +' : '+heading + '</b></div>');
            div.push('<div class="jtvd3-tlp-wrapper">');
            
                div.push('<table style="width:100%">');
                    for(var i in  tpCont){
                        div.push('<tr>');
                            div.push('<td>');
                              if(tlptype)
                                  div.push('<div class="tpl-legend jtvd3-tilp-legendicon" style="height:10px; width : 10px; background-color: '+color+'; float: left; margin-top: 2px;"></div>');
                              else
                                  div.push('<div class="tpl-legend jtvd3-tilp-legendicon" style="height:10px; width : 10px; background-color: '+color+'; float: left; border-radius: 20px; margin-top: 2px;"></div>');
                                  div.push('<div class="tpl-legend jtvd3-tilp-value" style="float: left; padding-left: 5px; text-transform: uppercase">'+i+'</div>');
                            div.push('</td>');
                            div.push('<td>');
                              div.push('<div class="jtvd3-tlp-float jtvd3-tlp-right"> ' + tpCont[i]+'</div>');
                            div.push('</td>');
                        div.push('</tr>');
                    }
                div.push('</table>');

            div.push('</div>');
        div.push('</div>');
        return div.join('');
    };
    jtvd3.utility.getColor = function (color) {
        //if you pass in nothing, get default colors back
        if (color === undefined) {
            return jtvd3.utility.defaultColor();

            //if passed an array, turn it into a color scale
        } else if (jtvd3.utility.isArray(color)) {
            var color_scale = d3.scale.ordinal().range(color);
            return function (d, i) {
                var key = i === undefined ? d : i;
                return d.color || color_scale(key);
            };

        } else {
            return color;
        }
    };
    
    jtvd3.utility.lineOptions = function (stroke, opacity, interpolate){
        var lineOpt = {
            strokeWidth : 1,
            areaOpacity : 0.5,
            interpolate : "cardinal"
        };
        return lineOpt.extend;
    };
    jtvd3.utility.extendDefaults = function(source, properties) {
        var property;
        for (property in properties) {
          if (properties.hasOwnProperty(property)) {
            source[property] = properties[property];
          }
        }
        return source;
    };
    jtvd3.utility.defaultColor = function () {
        return jtvd3.utility.getColor(d3.scale.category20().range());
    };
    jtvd3.utility.isArray = Array.isArray;
})();
