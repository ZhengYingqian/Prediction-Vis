import { Component, OnInit } from '@angular/core';
import { specOverview } from '../share/spec';
import vegaEmbed from 'vega-embed';
import * as d3 from 'd3';
import { Calendar } from '../share/calendar';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor() { }

  transform() {
    let spec = {};
    spec = specOverview;
    return spec;

  }
  ngOnInit() {
    // vegaEmbed('.calender', this.getSpec(), { actions: false });
    vegaEmbed('.crossfilter', this.transform(), { actions: false });
    this.drawCalender();
  }

  drawCalender() {
    d3.csv('assets/dji.csv').then(data => {
        const res = d3.pairs(data, ({close: previous}, {date, close}) => {
        return {date, value: (close - previous) / previous};
      });
      console.log(res);
      const cview = new Calendar('sunday');
      cview.chart(res);
    });
    }

}
