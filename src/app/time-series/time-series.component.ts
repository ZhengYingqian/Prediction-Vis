import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../core/http.service';
import { DataService } from '../core/data.service';
import { MultiLine } from '../share/multiline.component';
import * as d3 from 'd3';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit {
  ViewMultiline: MultiLine;
  EnvLines: MultiLine;
  @ViewChild('viewMultiline', { static: false }) viewMultiline;
  @ViewChild('envLines', { static: false }) envLines;

  data;
  lines;
  start = '2013/1/1';
  end = '2013/12/31';
  step = 7; // 聚合天数
  keys;
  options;
  leftKeys;
  cols = ['ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa',
    'daily_precipitation', 'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h'];
  others = ['AQI', 'month', 'day', 'week'];

  constructor(
    private service: HttpService,
    private dataSer: DataService,
    private ref: ChangeDetectorRef,
    private el: ElementRef) {
  }
  ngOnInit() {
    this.dataSer.dataToactive.subscribe((res1) => {
      this.data = res1;
      // console.log(this.data);
      this.dataSer.diseaseToActive.subscribe(res => {
        this.keys = res;
        this.leftKeys = this.keys.concat(this.cols);
        // console.log(this.keys);
        this.lines = this.getLines(this.data, this.keys);
        this.draw(this.lines, [0, 800]);
        this.ref.detectChanges();
      });
    });
    // this.getEnvLines();
  }

  getEnvLines() {
    d3.csv('assets/res_environment_day.csv').then(res => {
      this.draw1(this.getLines(res, this.cols), [0, 1]);
    });
  }

  // 根据时间索引数据获取多维折线图输入
  getLines(res, keys) {
    const lineGroupData = [];
    keys.forEach(v => {
      const item = {
        name: v,
        values: []
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
                value: element
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
  draw1(data, range) {
    this.EnvLines = new MultiLine(this.envLines.nativeElement, data, range);
    this.EnvLines.render();
  }

  // 图刷新
  select(start: any, end: any, res?: any) {
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
    const newLines = this.getLines(this.dataSer.selected_data, this.keys);
    this.ViewMultiline.clear();
    this.draw(newLines, [0, 800]);
    // this.el.nativeElement.querySelector('#embed-view').outerHTML = ' <div id="embed-view" style="text-align: center"></div>';
  }

}
