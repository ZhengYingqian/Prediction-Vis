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
  ngOnInit() {
    d3.csv('assets/2014-1-4.csv').then(res => {
      console.log(res);
      vegaEmbed('.crossfilter', this.transform(res), { actions: false });
    });
    // vegaEmbed('.calender', this.getSpec(), { actions: false });
    this.drawCalender();
  }

  transform(data) {
    let spec = specOverview;
    spec.data.values = data.map((u, i) => {
      u['age'] = parseInt(u['age']);
      return u;
    });
    // spec.
    // spec.data.values = [{'<12': 1000, '12-25': 2000]
    return spec;
  }

  drawCalender() {
    d3.csv('assets/icd_2014.csv').then(res => {
      console.log(res);
      const ori_data = res.map(object => {
        const temp = {
          'date': new Date(object['date']),
          'value': 0
        };
        for (const key in object) {
          if (object.hasOwnProperty(key) && key !== 'date') {
            const element = object[key];
            temp.value += parseInt(element, 10);
          }
        }
        return temp;
      });
      console.log(ori_data);
      const cview = new Calendar('monday');
      cview.chart(ori_data);
    });
    }

    getIncrease(data) {
      return d3.pairs(data, ({value: previous}, {date, value}) => {
        console.log(value, previous);
      return {date: new Date(date), value: (value - previous) / previous};
    });
    }

}
