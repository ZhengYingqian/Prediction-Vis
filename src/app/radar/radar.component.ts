import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { RadarChart } from '../share/radarchart';
import { corr1, corr2, cols, Dic } from '../share/correlation';
import { DataService } from '../core/data.service';
import { HttpService } from '../core/http.service';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css']
})
export class RadarComponent implements OnInit {
  corr = [corr1, corr2];
  pearson = this.corr.map(v => v.map(u => u[0]));
  radar = new RadarChart();
  constructor(private datsSer: DataService,
    private httpSer: HttpService) { }

  ngOnInit() {
    this.drawRader();
  }

  drawRader() {
    const w = 200,
      h = 200;

    const colorscale = d3.scaleOrdinal(d3.schemeCategory10);

    // Legend titles
    const LegendOptions = ['dis1'];

    const data = this.corr.map(v => {
      return v.map((u, i) => ({ 'axis': Dic[cols[i]], 'value': Math.abs(parseFloat(u[0].toFixed(2)))}));
    });
    console.log(data);
    // Options for the Radar chart, other than default
    const mycfg = {
      w: w,
      h: h,
      maxValue: 0.3,
      levels: 6,
      ExtraWidthX: 150
    };

    // Call function to draw the Radar chart
    // Will expect that data is in %'s
    this.radar.draw('#chart', data, mycfg);

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    const svg = d3.select('#draw')
      .selectAll('svg')
      .append('svg')
      .attr('width', w + 300)
      .attr('height', h)

    // Create the title for the legend
    const text = svg.append('text')
      .attr('class', 'title')
      .attr('transform', 'translate(90,0)')
      .attr('x', w - 70)
      .attr('y', 10)
      .attr('font-size', '12px')
      .attr('fill', '#404040')
      .text('correlation');

    // Initiate Legend	
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', 200)
      .attr('transform', 'translate(90,20)');
    // Create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append('rect')
      .attr('x', w - 65)
      .attr('y', function (d, i) { return i * 20; })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d, i) { return colorscale(i); });
    // Create text next to squares
    legend.selectAll('text')
      .data(LegendOptions)
      .enter()
      .append('text')
      .attr('x', w - 52)
      .attr('y', function (d, i) { return i * 20 + 9; })
      .attr('font-size', '11px')
      .attr('fill', '#737373')
      .text(function (d) { return d; });
  }

}
