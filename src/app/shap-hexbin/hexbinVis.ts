import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';
export class HexBinChart {

  id;

  constructor(idName) {
    this.id = idName;
    // this.draw();
  }

  chart(data) {
    const margin = ({ top: 20, right: 20, bottom: 30, left: 40 });
    const width = 600;
    const height = Math.max(640, width);
    const radius = 20;
    const x = d3.scaleLog()
      .domain(d3.extent(data, d => d.x))
      .rangeRound([margin.left, width - margin.right]);
    const y = d3.scaleLog()
      .domain(d3.extent(data, d => d.y))
      .rangeRound([height - margin.bottom, margin.top]);

    const svg = d3.select(this.id).append('svg')
      .attr('viewBox', [0, 0, width, height]);

    const yAxis = g => g.attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, '.1s'))
      .call(g => g.select('.domain').remove())
      .call(g => g.append('text')
        .attr('x', 4)
        .attr('y', margin.top)
        .attr('dy', '.71em')
        .attr('fill', 'currentColor')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text('SHAP value'));

    const xAxis = g => g.attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(null, ''))
      .call(g => g.select('.domain').remove())
      .call(g => g.append('text')
        .attr('x', width - margin.right)
        .attr('y', -4)
        .attr('fill', 'currentColor')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text('feature'));

    svg.append('g')
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    const hexbin = d3Hexbin.hexbin()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .radius(radius * width / 954)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const bins = hexbin(data);
    const color = d3.scaleSequential(d3.interpolateBuPu)
      .domain([0, d3.max(bins, d => d.length) / 2]);

    svg.append('g')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.1)
      .selectAll('path')
      .data(bins)
      .join('path')
      .attr('d', hexbin.hexagon())
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('fill', d => color(d.length));

    hexbin
      .x(d => x(d.x))
      .y(d => y(d.y))
      .radius(radius * width / 500)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

  }

  draw() {
    // console.log(d3.hexbin);

  }

}
