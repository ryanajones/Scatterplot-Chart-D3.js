/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const w = 800;
const h = 500;
const padding = 60;
const color = d3.scaleOrdinal(['#7369D8', '#FE5A5E']);

const tooltip = d3
  .select('.chart')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

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
    .range([padding, w - padding]);

  // yScale
  const yScale = d3
    .scaleTime()
    .domain(d3.extent(parsedData))
    .range([padding, h - padding]);

  // SVG
  svgContainer
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d, i) => xScale(years[i]))
    .attr('cy', (d, i) => yScale(parsedData[i]))
    .attr('r', (d) => 6)
    .attr('data-xvalue', (d, i) => years[i])
    .attr('data-yvalue', (d, i) => parsedData[i])
    .attr('transform', 'translate(0, 20)')
    .style('fill', (d, i) => color(data[i].Doping !== ''))
    .on('mouseover', (d, i) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          `${data[i].Name}: ${data[i].Nationality}<br> Year: ${
            data[i].Year
          }, Time: ${data[i].Time} ${
            data[i].Doping ? `<br><br>${data[i].Doping}` : ''
          }`
        )
        .attr('data-year', years[i])
        .style('left', `${xScale(years[i]) + 57}px`)
        .style('top', `${yScale(parsedData[i]) + 20}px`);
    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0);
    });

  // Bottom axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('R'));
  svgContainer
    .append('g')
    .call(xAxis)
    .attr('transform', 'translate(0, 460)')
    .attr('id', 'x-axis');

  // Left axis
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(d3.timeSecond.every(15))
    .tickFormat((d) => d3.timeFormat(specifier)(d));

  svgContainer
    .append('g')
    .call(yAxis)
    .attr('transform', 'translate(60,20)')
    .attr('id', 'y-axis')
    .attr('class', 'y axis');

  // Title text
  svgContainer
    .append('text')
    .attr('id', 'title')
    .attr('x', 150)
    .attr('y', 27)
    .text('Doping in Professional Bicycle Racing')
    .style('fill', 'white');

  svgContainer
    .append('text')
    .attr('id', 'sub-title')
    .attr('x', 310)
    .attr('y', 50)
    .text("35 Fastest times up Alpe d'Huez");

  svgContainer
    .append('g')
    .append('rect')
    .attr('class', 'font-awesome-wrapper')
    .attr('x', 90)
    .attr('width', 35)
    .attr('height', 35)
    .attr('ry', 9);

  svgContainer
    .append('text')
    .attr('class', 'fa fa-2x')
    .attr('x', 95)
    .attr('y', 25)
    .style('fill', '#dde1e5')
    .style('background', 'blue')
    .text('\uf206');

  svgContainer
    .append('text')
    .attr('x', -315)
    .attr('y', 14)
    .attr('transform', 'rotate(-90)')
    .style('font-size', '1.4em')
    .style('fill', '#dde1e5')
    .text('Time in Minutes');

  // Legend
  const legendContainer = svgContainer.append('g').attr('id', 'legend');

  const legend = legendContainer
    .selectAll('#legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend-label')
    .attr('transform', (d, i) => `translate(0,${h / 2 - i * 29})`);

  legend
    .append('rect')
    .attr('x', w - 90)
    .attr('y', 30)
    .attr('width', 25)
    .attr('height', 25)
    .attr('ry', '9')
    .style('fill', color);

  legend
    .append('text')
    .attr('x', w - 95)
    .attr('y', 42)
    .attr('dy', '.35em')
    .style('fill', '#dde1e5')
    .style('text-anchor', 'end')
    .text(function (d) {
      if (d) return 'Riders with doping allegations';

      return 'No doping allegations';
    });
});
