import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, AfterViewInit, ɵConsole } from '@angular/core';
import { HttpService } from '../core/http.service';
import { DataService } from '../core/data.service';
import { MultiLine } from '../share/multiline.component';

export interface PeriodicElement {
  name: string;
  position: number;
  MSE: string;
  MAE: string;
  R2: string;
  RMSE: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Linear regression', MSE: '0.024', MAE: '0.125', R2: '0.006', RMSE: '0.156' },
  { position: 2, name: 'SVM', MSE: '0.024', MAE: '0.124', R2: '0.015', RMSE: '0.155' },
  { position: 3, name: 'KNN', MSE: '0.025', MAE: '0.126', R2: '0.159', RMSE: '-0.036' },
  { position: 4, name: 'Random forest', MSE: '0.024', MAE: '0.123', R2: '0.027', RMSE: '0.155' }
];

const ELEMENT_DATA_2: PeriodicElement[] = [
  { position: 1, name: 'Linear regression', MSE: '0.024', MAE: '0.125', R2: '0.006', RMSE: '0.156' },
  { position: 2, name: 'SVM', MSE: '0.024', MAE: '0.124', R2: '0.015', RMSE: '0.155' },
  { position: 3, name: 'KNN', MSE: '0.025', MAE: '0.126', R2: '0.159', RMSE: '-0.036' },
  { position: 4, name: 'Random forest', MSE: '0.024', MAE: '0.123', R2: '0.027', RMSE: '0.155' }
];

const ELEMENT_DATA_1: PeriodicElement[] = [
  { position: 1, name: 'Linear regression', MSE: '0.015', MAE: '0.075', R2: '0.0398', RMSE: '0.121' },
  { position: 2, name: 'SVM', MSE: '0.014', MAE: '0.068', R2: '0.442', RMSE: '0.117' },
  { position: 3, name: 'Decision tree', MSE: '0.014', MAE: '0.069', R2: '0.430', RMSE: '0.118' },
  { position: 3, name: 'Random forest', MSE: '0.009', MAE: '0.045', R2: '0.430', RMSE: '0.118' },
  { position: 4, name: 'XGboost', MSE: '0.009', MAE: '0.045', R2: '0.750', RMSE: '0.094' }
];

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit {
  ViewMultiline: MultiLine;
  EnvLines: MultiLine;
  @Input() id: number;
  @Input() disease: any;

  data;
  classname;
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
  disabled = ['daily_precipitation', 'SO2'];
  dataSource;
  // dims = cols;

  displayedColumns: string[] = ['position', 'name', 'MSE', 'MAE', 'R2', 'RMSE'];
  show = 1;

  constructor(
    private dataSer: DataService,
    private ref: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.classname = '.viewMultiline' + this.id;
    // // console.log(this.data);
    // // console.log(this.id);
    this.keys = [this.disease];
    // this.leftKeys = this.keys.concat(this.cols);
    this.data = [{ 'name': this.disease, 'values': this.dataSer.getByName(this.disease) }];
    // // console.log(this.keys);
    this.ViewMultiline = new MultiLine(this.data, this.classname, [0, 500]);
    this.ViewMultiline.render(this.data);
    this.ref.detectChanges();
    // this.cols = this.dataSer.predict_group[this.disease];
    // this.dataSource = this.id == 1 ? ELEMENT_DATA : ELEMENT_DATA_1;
  }


  showBTN(value) {
    this.show = value;

  }
  // getEnvLines() {
  //   d3.csv('assets/res_environment_day.csv').then(res => {
  //     this.draw1(this.getLines(res, this.cols), [0, 1]);
  //   });
  // }

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
    console.log(lineGroupData);
    return lineGroupData;
  }

  // 绘制多维折线图
  // draw(data, range) {
  //   this.ViewMultiline = new MultiLine(data, this.classname,  range);
  //   this.ViewMultiline.render();
  // }
  // draw1(data, range) {
  //   this.EnvLines = new MultiLine(this.envLines.nativeElement, data, range);
  //   this.EnvLines.render();
  // }

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
    // const newLines = this.getLines(this.dataSer.selected_data, this.keys);
    this.ViewMultiline = new MultiLine(this.data, this.classname, [0, 500]);
    this.ViewMultiline.render(this.data);
    // this.ViewMultiline.clear();
    // this.draw(newLines, [0, 800]);
    // this.el.nativeElement.querySelector('#embed-view').outerHTML = ' <div id="embed-view" style="text-align: center"></div>';
  }

  deleteDim(dim) {
    delete this.cols[this.cols.indexOf(dim)];
    console.log(this.cols);
  }

  refresh() {

  }

}
