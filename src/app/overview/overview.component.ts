import { Component, OnInit } from '@angular/core';
import { specOverview } from '../share/spec';
import vegaEmbed from 'vega-embed';
import * as d3 from 'd3';
import { Calendar } from '../share/calendar';
import { HttpService } from '../core/http.service';
import { DataService } from '../core/data.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private service: HttpService,
    private dataSer: DataService) { }
  ngOnInit() {
    d3.csv('assets/2014-1-4.csv').then(res => {
      // console.log(res);
      vegaEmbed('.crossfilter', this.transform(res), { actions: false });
    });
    this.drawCalender();
    // this.getDiseaseCount('E05.900');
    // this.getRecords('E05.900');
  }

  transform(data) {
    let spec = {};
    spec = specOverview;
    spec.data.values = data.map((u, i) => {
      u['age'] = parseInt(u['age'], 10);
      return u;
    });
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
      const cview = new Calendar('monday', this.dataSer);
      cview.chart(ori_data);
    });
  }

  getIncrease(data) {
    return d3.pairs(data, ({ value: previous }, { date, value }) => {
      console.log(value, previous);
      return { date: new Date(date), value: (value - previous) / previous };
    });
  }

  getDiseaseCount(dis) {
    const params = { 'dim': [dis], 'start': '2014-1-1', 'stop': '2015-1-1', 'normalization': false };
    this.service.getDisease(params).subscribe(res => {
      console.log(res);
    });
  }

  getRecords(dis) {
    const params = {'dim': [dis], 'start': '2014-1-1', 'stop': '2015-1-1'};
    this.service.getRecords(params).subscribe(res => {
      console.log(res);
    });
  }
}
