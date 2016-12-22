// Variables
var width = 800,
	height = 500,
	svg = d3.select("#map")
	.append("svg")
	.attr("width", width)
	.attr("height", height),
	colorScale = ['#E1FF95', '#008050'],
	color = d3.scale.linear()
	.domain([0, 8])
	.range(colorScale),
	data = d3.map(),
	projection = d3.geo.equirectangular()
	.center([-96.03542, 41.69553])
	.scale(2000)
	.translate([width / 2, height / 2]),
	path = d3.geo.path()
	.projection(projection),
	tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-20, 0])
	.html(function(d) {
		return "<strong>" + d.properties.name + " - </strong><span>" + data.get(d.properties.name) + " national parks</span>"
	});

// Queue
queue()
	.defer(d3.json, "http://rawgit.com/geobabbler/us-state-squares/380435e6d7295251519797ecc38d3ee91fb05a01/state_squares.geojson")
	.defer(d3.csv, "https://raw.githubusercontent.com/lucyconklin/d3_map/master/state_data", function(d) {
		data.set(d.state, +d.bpc);
})
	.await(ready);

// Build map and labels
function ready(error, d) {
  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(d.features)
    .enter()
    .append("path")
    .attr("class", function(d) {
      return d.properties.name;
    })
    .style("fill", function(d) {
      return color(data.get(d.properties.name))
    })
    .attr("d", path)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
	svg.selectAll('.place-label')
	.data(d.features)
	.enter()
	.append('text')
	.attr('class', 'place-label')
	.attr('transform', function(d){
		return 'translate('+ path.centroid(d)+')';
	})
	.attr('dy', '.5em')
	.attr('dx', '-.7em')
	.text(function(d){
		return d.properties.name;
	});
	svg.call(tip);

	//Label
	var w = 260,
			h = 40,
			key = d3.select('#legend')
			.append('svg')
			.attr('width', w)
			.attr('height', h),
			legend = key.append('defs')
			.append('svg:linearGradient')
			.attr('id', 'gradient')
			.attr('y1', '100%')
			.attr('x1', '0%')
			.attr('y2', '100%')
			.attr('x2', '100%')
	legend.append('stop')
		.attr('offset', '0%')
		.attr('stop-color', colorScale[0])
	legend.append('stop')
		.attr('offset', '100%')
		.attr('stop-color', colorScale[1])
	key.append('rect')
		.attr('width', w - 10)
		.attr('height', h - 20)
		.style('fill', 'url(#gradient)')
		.attr('transform', 'translate(0,0)'),
	y = d3.scale.linear()
		.range([0, 250])
		.domain([0, 8]),
	yAxis = d3.svg.axis()
		.scale(y)
		.ticks(4);
	key.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(10,15)')
		.call(yAxis);

	//Animations
	var tl = new TimelineLite(),
			intro = ('#intro'),
			map = ('#map'),
			legend = ('#legend'),
			footer = ('#footer');
	tl
		.from(intro, 1, {
			y: '95%',
			scale: .98,
			ease: Power1.easeInOut,
			autoAlpha: 0})
		.from(map, .75, {
			y: '95%',
			autoAlpha: 0
		}, '+=.5')
		.from(legend, .75, {
			x: 1000,
			autoAlpha: 0
		}, '-=.75')
		.from(footer, .75, {
			y: '95%',
			scale: .9,
			autoAlpha: 0
		});
}
