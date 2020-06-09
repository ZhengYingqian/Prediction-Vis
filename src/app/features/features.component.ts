import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { HttpService } from '../core/http.service';
import { DataService } from '../core/data.service';
import * as d3 from 'd3';
import vegaEmbed from 'vega-embed';
import { specInit, specRepeat, specY, rowsSpec } from './spec';
import { specOverview } from '../share/spec';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  columns;
  columns1;
  columns2;
  data;
  displayedColumns;
  dataSource;
  // @Input showType:
  constructor(private service: HttpService,
    private dataSer: DataService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    d3.csv('assets/env.csv').then(res => {
      // d3.csv('assets/hybridModelInput.csv').then(res => {

      console.log(res);
      this.columns1 = res.columns.slice(0, 4);
      // this.columns1 = ['trend', 'trend', 'yhat_upper', 'trend_upper'];
      // this.columns1 = ['ave_c', 'ave_c', 'max_c', 'ave_ws'];
      this.columns2 = res.columns.slice(3, 7);
      // this.columns2 = ['yhat_lower', 'yhat_lower', 'trend_lower', 'additive_terms'];
      // this.columns2 = ['min_c', 'min_c', 'ave_ws', 'ave_hpa'];
      // this.columns
      this.data = res;
      this.draw1(this.data, this.columns1);
      this.draw2(this.data, this.columns2);
    });
    d3.csv('assets/res_environment_day.csv').then(res => {
      // console.log(res);
      this.drawY(res);
    });
    // d3.csv('assets/statistics1.csv').then(res => {
    d3.csv('assets/ori_statistics.csv').then(res => {

      console.log(res);
      this.displayedColumns = res.columns;
      this.dataSource = res.slice(0, 6);
    });
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

  spec1(data, column) {
    // console.log(data);
    const spec = rowsSpec;
    // @ts-ignore
    spec.data = { 'values': data };
    const arr = column;
    arr.shift();
    spec.repeat.row = arr;
    // spec.repeat.row = this.leftKeys;
    // console.log(spec);
    return spec;
  }

  // 单列
  spec2(data, column) {
    // console.log(data);
    const spec = specRepeat;
    // @ts-ignore
    spec.data = { 'values': data };
    const arr = column;
    arr.shift();
    spec.repeat.row = arr;
    // spec.repeat.row = this.leftKeys;
    // console.log(spec);
    return spec;
  }

  // 绘制多行多列相关性折线图
  draw1(data, column) {
    // @ts-ignore
    vegaEmbed('.corr1', this.spec1(data, column), { actions: false });
    this.ref.detectChanges();
  }

  draw2(data, column) {
    // @ts-ignore
    vegaEmbed('.corr2', this.spec1(data, column), { actions: false });
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
