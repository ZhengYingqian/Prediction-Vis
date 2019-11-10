import * as d3 from 'd3';
// @ts-ignore
export class MultiLine {
  data;
  year;
  width = 600;
  height = 300;
  margin = 30;
  textW = 200;
  duration = 250;
  range = [0, 500];
  className;

  constructor(data, name, range?) {
    this.data = data;
    this.className = name;
    if (!!range) {
      this.range = range;
    }
  }

  render() {
    console.log(this.data);
    if (!!d3.select(this.className).select('svg')) {
      this.clear();
    }
    /* Scale */
    const xScale = d3.scaleTime()
       // @ts-ignore
      .domain(d3.extent(this.data[0].values, d => d.date))
      // .domain([-1, 1])
      .range([0, this.width - this.textW]);

    const yScale = d3.scaleLinear()
      .domain(this.range)
      .range([this.height - this.margin, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    // const zoom = d3
    // .zoom()
    // .scaleExtent([1, Infinity])
    // .translateExtent([[0, 0], [this.width, this.height]])
    // .extent([[0, 0], [this.width, this.height]])
    // .on('zoom', zoomed);

    // const brush = d3
    // .brushX()
    // .extent([[0, 0], [this.width, this.height]])
    // .on('brush end', brushed);


    /* Add SVG */
    const svg = d3.select(this.className).append('svg')
      .attr('width', (this.width + this.textW) + 'px')
      .attr('height', (this.height + this.margin) + 'px')
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);

    /* Add line into SVG */
    const line = d3.line()
      .x(d => {
        // @ts-ignore
        return xScale(d.date);
      })
      // @ts-ignore
      .y(d => yScale(d.value));
    //       console.log(line);

    const lines = svg.append('g')
      .attr('class', 'lines');

    lines.selectAll('.line-group')
      .data(this.data).enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('fill', 'none')
      .attr('class', 'line')
      .attr('d', (d: any) => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', 0.75)
      .on('mouseover', function (d, i) {
        // console.log(d);
        d3.selectAll('.line')
          .style('opacity', 0.1);
        d3.selectAll('.circle')
          .style('opacity', 0.25);
        d3.selectAll('.title-text')
          .style('opacity', 0.1);
        d3.selectAll('.title' + i)
          .style('opacity', 0.85);
        d3.select(this)
          .style('opacity', 0.85)
          .style('stroke-width', 2.5)
          .style('cursor', 'pointer');
      })
      .on('mouseout', function (d) {
        d3.selectAll('.line')
          .style('opacity', 0.25);
        d3.selectAll('.circle')
          .style('opacity', 0.85);
        d3.selectAll('.title-text')
          .style('opacity', 0.85);
        d3.select(this)
          .style('stroke-width', 1.5)
          .style('cursor', 'none');
      });

    // legend
    lines.selectAll('.line-group2')
      .data(this.data).enter()
      .append('g')
      .append('text')
      .attr('class', function (d, i) {
        return 'title-text title' + i;
      })
      .style('fill', function (d, i) {
        return color(i);
      })
      .text(function (d: any) {
        return d.name;
      })
      .attr('text-anchor', 'middle')
      // .attr('x', this.width - this.textW / 2 - 60)
      .attr('x', 100)
      .attr('y', function (d, i) {
        // console.log(d, i);
        return 5 + 20 * i;
      })
      .on('click', function (d: any) {
        d3.selectAll('.line')
          .style('opacity', function (di: any) {
            if (di.name === d.name) {
              return 0.8;
            } else {
              return 0.1;
            }
          })
          .style('stroke-width', function (di: any) {
            if (di.name === d.name) {
              return 2.5;
            } else {
              return 1.5;
            }
          })
          .style('cursor', 'none');
        d3.selectAll('.circle')
          .style('opacity', function (di) {
            return select(d, di);
          });
        d3.selectAll('.title-text')
          .style('opacity', function (di) {
            return select(d, di);
          });
      });

    /* Add circles in the line */
    lines.selectAll('circle-group')
      .data(this.data).enter()
      .append('g')
      .style('fill', (d, i) => color(i))
      .selectAll('circle')
      // @ts-ignore
      .data(d => d.values).enter()
      .append('g')
      .attr('class', 'circle')
      .on('mouseover', function (d) {
        d3.select(this)
          .style('cursor', 'pointer')
          .append('text')
          .attr('class', 'text')
          .text(`${d.value}`)
          .attr('x', ele => xScale(ele.date) + 5)
          .attr('y', ele => yScale(ele.value) - 10);
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('cursor', 'none')
          .transition()
          .duration(this.duration)
          .selectAll('.text').remove();
      })
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 1)
      .style('opacity', 0.85)
      .on('mouseover', function (d) {
        d3.select(this)
          .transition()
          // @ts-ignore
          .duration(this.duration)
          .attr('r', 6);
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .transition()
          // @ts-ignore
          .duration(this.duration)
          .attr('r', 3);
      });

    /* Add Axis into SVG */
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append('g')
      .attr('class', 'xaxis1')
      .attr('transform', `translate(0, ${this.height - this.margin})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'yaxis1')
      .call(yAxis)
      .append('text')
      .attr('y', 15)
      .attr('transform', 'rotate(-90)')
      .attr('fill', '#000')
      .text('数量');
  }

  clear() {
    d3.select(this.className).select('svg').remove();
  }
}


function select(a, b) {
  if (a.name === b.name) {
    return 0.85;
  } else {
    return 0.2;
  }
}
