import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {HttpService} from '../core/http.service';
import { DataService } from '../core/data.service';
import { MultiLine } from '../share/multiline.component';
import { specInit } from '../share/spec';
import * as d3 from 'd3';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit {
  ViewMultiline: MultiLine;
  @ViewChild('viewMultiline', {static: false}) viewMultiline;

  data;
  lines;
  start = '2013/1/1';
  end = '2013/12/31';
  step = 7; // 聚合天数
  keys;
  options;
  leftKeys;
  cols = ['ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa',
  'daily_precipitation', 'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h', 'AQI', 'month', 'day', 'week' ];

  constructor(
    private service: HttpService,
    private dataSer: DataService,
    private el: ElementRef) {
  }
  ngOnInit() {
    this.dataSer.addDisease('K29.500');
    console.log(this.dataSer.diseaseGroup);
    d3.csv('assets/parts.csv').then(res => {
      // console.log(res);
      this.keys =  ['pediatric', 'gynecology', 'emergency'];
      this.leftKeys = this.keys.concat(this.cols);
      this.data = res;
      this.lines = this.getLines(this.data);
      // console.log(this.lines);
      this.draw(this.lines, [0, 1000]);
    });
  }

  norm2data(type, res) {
    if (type === 'norm') {
      const new_res = {};
      res.norm.map((v, i) => {
        const temp = {};
        res.keys.forEach((u, j) => {
          temp[u] = v[j];
        });
        new_res[Date.parse('2013/1/1') + 60 * 60 * 24 * i] = temp;
      });
      return new_res;
    } else {
      return res;
    }
  }

  // 根据options checkbox 获取keys
  getLeftKeys() {
    return this.options.filter(v => {
      return v.checked;
    }).map(v => {
      return v.name;
    });
  }

  // 根据日期索引对象得到快速可视化数组
  getJson(res) {
    const keys = this.keys;
    const data = [];
    for (const item in res) {
      if (res.hasOwnProperty(item)) {
        data.push(Object.assign({ 'date': item }, res[item]));
      }
    }
    return data;
  }

  // 根据时间索引数据获取多维折线图输入
  getLines(res) {
    const lineGroupData = [];
    this.keys.forEach(v => {
      const item  = {
        name : v,
        values : []
    };
    lineGroupData.push(item);
    });
    res.forEach(object => {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key];
          lineGroupData.map(u => {
            if (u.name === key) {
              u.values.push({
                date: Date.parse(object['date']),
                value: parseInt(object[key], 10)
              });
            }
          });
        }
      }
    });
    // console.log(lineGroupData);
    return lineGroupData;
  }

  // 绘制多维折线图
  draw(data, range) {
    this.ViewMultiline = new MultiLine(this.viewMultiline.nativeElement, data, range);
    this.ViewMultiline.render();
  }

  // 图刷新
  select(start: any, end: any, res?: any) {
    this.leftKeys = this.getLeftKeys();
    const data = !!res ? res : this.data;
    const newData = {};
    for (const day in data) {
      if (data.hasOwnProperty(day)) {
        // @ts-ignore
        if (day > Date.parse(start) && day < Date.parse(end)) {
          newData[day] = data[day];
        }
      }
    }
    // console.log(newData);
    const newLines = this.getLines(newData);
    this.ViewMultiline.clear();
    this.draw(newLines, [0, 1000]);
    this.el.nativeElement.querySelector('#embed-view').outerHTML = ' <div id="embed-view" style="text-align: center"></div>';
  }

  // 归一化结果
  normData(start: any, end: any) {
    const t = 'norm';
    this.service.getData(t).subscribe(res => {
      // console.log(res);
      this.data = this.norm2data(t, res);
      console.log(this.data);
      this.keys = Object.keys(this.data['1356969600000']);
      // this.options = this.keys.map((v, i) => {
      //   return {
      //     'checked': i < 6,
      //     'value': v,
      //     'name': v
      //   };
      // });
      this.leftKeys = this.getLeftKeys();
      console.log(this.leftKeys);
      this.lines = this.getLines(this.data);
      console.log(this.lines);
      this.draw(this.lines, [0, 1]);
    });
  }

  // 获取vega配置文件
  spec(data) {
    console.log(data);
    const spec = specInit;
    // @ts-ignore
    spec.spec.data = { 'values': data };
    spec.repeat.column = this.leftKeys;
    spec.repeat.row = this.leftKeys;
    console.log(spec);
    return spec;
  }

}
