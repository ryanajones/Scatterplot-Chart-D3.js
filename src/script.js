/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const w = 800;
const h = 500;
const padding = 60;

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
).then(function (data) {
  const years = [];
  const minutes = [];
  data.forEach((currentItem) => {
    years.push(currentItem.Year);
    minutes.push(currentItem.Time);
  });
  const time = [years, minutes];
d
  // Parse time
  const specifier = '%M:%S';
  const parsedData = minutes.map((d) => d3.timeParse(specifier)(d));

  const svgContainer = d3
    .select('.chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // xScale
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years) - 1, d3.max(years) + 1])
    .range([0, w]);

  // yScale
  const yScale = d3
    .scaleTime()
    .domain(d3.extent(parsedData))
    .range([h - padding, padding]);

  // SVG
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(d.Year))
    .attr('cy', (d) => yScale(d.Time))
    .attr('r', (d) => 5);

  // Bottom axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('R'));
  d3.select('svg')
    .append('g')
    .call(xAxis)
    .attr('transform', 'translate(60, 440)')
    .attr('id', 'x-axis');

  // Left axis
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(d3.timeSecond.every(15))
    .tickFormat((d) => d3.timeFormat(specifier)(d));

  d3.select('svg')
    .append('g')
    .call(yAxis)
    .attr('transform', 'translate(60,0)')
    .attr('id', 'y-axis')
    .attr('class', 'y axis');
});
