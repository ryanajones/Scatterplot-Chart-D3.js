/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const w = 800;
const h = 400;
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

  const svgContainer = d3
    .select('.chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // xScale
  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range(padding, w - padding);

  // yScale
  const yScale = d3
    .scaleTime()
    .domain([d3.min(minutes), d3.max(minutes)])
    .range(h - padding, padding);

  // SVG
  d3.select('svg')
    .selectAll('circle')
    .data(time)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => xScale(d[0][i]))
    .attr('cy', (d, i) => yScale(d[1][i]))
    .attr('r', (d) => 5);

  // Bottom axis
  const xAxis = d3.axisBottom(xScale);
  d3.select('svg')
    .append('g')
    .call(xAxis)
    .attr('transform', 'translate(60,400)')
    .attr('id', 'x-axis');

  // Left axis
  const yAxis = d3.axisLeft(yScale);
  d3.select('svg')
    .append('g')
    .call(yAxis)
    .attr('transform', 'translate(60,0)')
    .attr('id', 'y-axis');
});
