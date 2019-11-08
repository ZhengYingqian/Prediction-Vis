import { Component, OnInit } from '@angular/core';
import { Sunburst } from '../share/sunburst';
import { HttpService } from '../core/http.service';
import { DataService } from '../core/data.service';

@Component({
  selector: 'app-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrls: ['./sunburst.component.css']
})
export class SunburstComponent implements OnInit {

  constructor(private service: HttpService,
    private dataSer: DataService) { }

  ngOnInit() {
    this.dataTransform();
  }

  drawSunburst(data) {
    const sunburst = new Sunburst(this.dataSer);
    sunburst.chart(data);
  }

  getleaf(object) {
    const res = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const element = object[key];
        if (typeof (element) !== 'object') {
          res.push({
            'name': key,
            'value': element
          });
        } else {
          const childrenKeys = Object.keys(element);
          const children = childrenKeys.slice(0, 10).map((u, i) => {
            if (i < 10) {
              return {
                'name': u,
                'value': element[u]
              };
            }
          });
          if (res.length < 10) {
            res.push({
              'name': key,
              'children': children
            });
          }
        }
      }
    }
    // console.log(res);
    return res;
  }

  getDATA(obj, root) {
    const name = Object.keys(obj).slice(0, 10);
    name.forEach((u, i) => {
      if (i < 10) {
        root['children'].push({
          'name': u,
          'children': this.getleaf(obj[u])
        });
      }
    });
    return root;
  }

  dataTransform() {
    const root = {
      'name': '门诊',
      'children': []
    };
    this.service.loadJson('assets/mixallpart.json')
      .subscribe(res => {
        const data = this.getDATA(res, root);
        console.log(data);
        console.log(res);
        const sunburst = new Sunburst(this.dataSer);
        sunburst.chart(data);
      });
  }

}
