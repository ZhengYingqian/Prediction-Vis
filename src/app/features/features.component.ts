import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../core/http.service';
import { DataService } from '../core/data.service';
import * as d3 from 'd3';
import vegaEmbed from 'vega-embed';
import { specInit, specRepeat, specY } from './spec';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  columns;
  data;
  constructor(private service: HttpService,
    private dataSer: DataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    d3.csv('assets/env.csv').then(res => {
      // console.log(res);
      this.columns = res.columns.slice(0, 7);
      this.data = res;
      this.draw(this.data, this.columns);
      this.draw1(this.data);
    });
    d3.csv('assets/res_environment_day.csv').then(res => {
      // console.log(res);
      this.drawY(res);
    });
  }

  extractData(data, column) {
    const dataGroup = {};
    column.forEach(v => {
      dataGroup[v] = [];
    });
    data.forEach(element => {
      for (const key in element) {
        if (element.hasOwnProperty(key)) {
          dataGroup[key].push(element[key]);
        }
      }
    });
    // console.log(dataGroup);
    return dataGroup;
  }

  // 获取vega配置文件
  spec(data, x) {
    // console.log(data);
    const spec = specInit;
    // @ts-ignore
    spec.data = { 'values': data };
    spec.encoding.x.field = x;
    // spec.repeat.column = this.leftKeys;
    // spec.repeat.row = this.leftKeys;
    // console.log(spec);
    return spec;
  }

  // 绘制频谱分布图
  draw(data, columns) {
    columns.forEach((v, i) => {
      // @ts-ignore
      vegaEmbed('.feature' + i.toString(), this.spec(data, v), { actions: false });
      this.ref.detectChanges();
    });
  }

  spec1(data) {
    // console.log(data);
    const spec = specRepeat;
    // @ts-ignore
    spec.data = { 'values': data };
    const arr = this.columns;
    arr.shift();
    spec.repeat.column = arr;
    // spec.repeat.row = this.leftKeys;
    // console.log(spec);
    return spec;
  }

  // 绘制多行多列相关性折线图
  draw1(data) {
    // @ts-ignore
    vegaEmbed('.corr', this.spec1(data), { actions: false });
    this.ref.detectChanges();
  }

  specY(data) {
    // console.log(data);
    const spec = specY;
    // @ts-ignore
    spec.data = { 'values': data };
    // const arr = this.columns;
    // arr.shift();
    // spec.repeat.row = arr;
    // spec.repeat.row = this.leftKeys;
    // console.log(spec);
    return spec;
  }

  drawY(data) {
    // @ts-ignore
    vegaEmbed('.result', this.specY(data), { actions: false });
    this.ref.detectChanges();
  }
}
