import { EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { MultiLine } from '../share/multiline.component';

export class DataService {
  ViewMultiline: MultiLine;
  cols = ['ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa',
    'daily_precipitation', 'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h'];
  others = ['AQI', 'month', 'day', 'week'];

  ori_disease; // 初始disease
  ori_data; // 所有记录records
  ori_corr_pearson; // 皮尔森相关性系数
  ori_corr_mic; // MIC相关系数

  selected_corr = []; // 所有相关性
  selected_disease = ['J40.x00']; // 可视化的疾病
  selected_data = []; // 可视化的诊疗记录
  select_day = '2014-1-1'; // 选择的日期
  start_day = '2014-1-1'; // 开始日期
  end_day = '2018-1-1'; // 结束日期

  predict_group = {}; // 特征选择和建模结果
  env_data;
  env_col; // 选择的环境变量

  dataToactive = new EventEmitter<any>();
  diseaseToActive = new EventEmitter<any>();
  predictToActive = new EventEmitter<any>();
  dayToActive = new EventEmitter<any>();

  constructor() {
    this.loadData();
    this.loadCorr();
    this.loadEnv();
    this.loadPredictionGroup();
  }

  // 初始化疾病和数据
  loadData() {
    d3.csv('assets/icd_2014.csv').then(res => {
      this.ori_data = res;
      this.ori_disease = res;
      // this.selected_disease = res.columns.slice(1, 6);
      this.selected_data = this.filterByName(this.selected_disease);
      this.dataToactive.emit(this.selected_data);
      this.diseaseToActive.emit(this.selected_disease);
      // console.log(this.ori_data);
    });
  }

  // 加载相关性
  loadCorr() {
    d3.csv('assets/Icd_env_person.csv').then(res => {
      this.ori_corr_pearson = res;
      console.log(res);
    });
    d3.csv('assets/Icd_env_MIC.csv').then(res => {
      this.ori_corr_mic = res;
      console.log(res);
    });
  }

  // 加载环境数据
  loadEnv() {
    d3.csv('assets/env.csv').then(res => {
      this.env_data = res;
      console.log(res);
    });
  }

  // names: 预测的疾病 [],初始化为selected_disease
  // output: {'d1': [keys]}
  loadPredictionGroup() {
    this.selected_disease.forEach(u => {
      this.predict_group[u] = {};
    });
    this.predictToActive.emit(this.predictToActive);

  }
  getCorrByName(name, type) {
    const corr = [];
    if (type === 'mic') {
      this.ori_corr_mic.forEach(u => {
        const s = u[name];
        const temp = {
          axis: u['dim'],
          value: Math.abs(parseFloat(s.substring(0, s.indexOf('.') + 3)))
        };
        corr.push(temp);
      });
    } else if (type === 'pearson') {
      this.ori_corr_pearson.forEach(u => {
        const s = u[name];
        const temp = {
          axis: u['dim'],
          value: Math.abs(parseFloat(s.substring(0, s.indexOf('.') + 3)))
        };
        corr.push(temp);
      });
    }
    return corr;
  }

  loadAllcorr(name) {
    return [this.getCorrByName(name, 'pearson'), this.getCorrByName(name, 'mic')];
  }

  filterByName(names) {
    return this.ori_data.map(object => {
      const newItem = { date: object['date'] };
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key];
          if (names.indexOf(key) !== -1 && (key !== 'date')) {
            newItem[key] = parseInt(element, 10);
          }
        }
      }
      return newItem;
    });
  }

  // 输入 disease[]
  // 输出 group{'d1': {[day and value]}, ''}
  extractDisease(names) {
    const res = {};
    names.forEach((v) => res[v] = []);
    this.ori_data.map(object => {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const newItem = { date: object['date'] };
          const element = object[key];
          if (names.indexOf(key) !== -1 && (key !== 'date')) {
            newItem['value'] = parseInt(element, 10);
            res[key].push(newItem);
          }
        }
      }
    });
    return res;
  }

  // 输入 disease
  // 输出 data: {'name':disease, values: [{day, value}[]}]},
  // day: date.parse:1365004800000
  getByName(name) {
    return this.ori_data.map(object => {
      const newItem = { date: Date.parse(object['date']) };
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          const element = object[key];
          if (name === key) {
            newItem['value'] = parseInt(element, 10);
          }
        }
      }
      return newItem;
    });
  }

  getDiseaseCount(data, disease) {
    const arr = [];
    const keys = Object.keys(data);
    keys.forEach(element => {
      arr.push({
        'date': Date.parse(element),
        'value': data[element][disease]
      });
    });

    const sortBy = (a, b) => (a.date - b.date);
    arr.sort(sortBy);
    console.log(arr);
    this.predict_group[disease]['num'] = arr;
    // console.log(this.predict_group[disease]['num']);
    return arr;
  }

  addDisease(name) {
    this.selected_disease.push(name);
    this.selected_data = this.filterByName(this.selected_disease);
    this.dataToactive.emit(this.selected_data);
    // console.log(this.selected_data);
  }

  getEnvByParams(name, sday, eday, norm?) {
    const arr = [];
    this.env_data.forEach(u => {
      const t = Date.parse(u.date);
      if (t >= sday && t < eday) {
        arr.push({ 'date': t, 'value': u[name] })
      }
    });
    // console.log(arr);
    return arr;
  }

  getRangeEnv(cols, sday, eday, norm?) {
    const arr = [];
    this.env_data.forEach(u => {
      const t = Date.parse(u.date);
      if (t >= sday && t < eday) {
        // arr.push(u);
        const temp = [];
        cols.forEach(element => {
          temp.push(u[element]);
        });
        arr.push(temp);
      }
    });
    // console.log(arr);
    return arr;
  }

  addEnv(name, id) {
    const i = id[id.length - 1];
    this.env_col = name;
    console.log(this.env_col);
    const envD = this.getEnvByParams(name, Date.parse(this.start_day), Date.parse('2015-1-1'));
    const data = [{ 'name': this.selected_disease[i], 'values': this.predict_group[this.selected_disease[i]]['num'] },
    { 'name': name, 'values': envD }];
    this.drawLine(i, data);
  }

  getPredicArr(i) {
    const allEnv = this.getRangeEnv(this.cols, Date.parse(this.start_day), Date.parse('2015-1-1'));
    const num = this.predict_group[this.selected_disease[i]]['num'].map(u => u.value);
    return { x: allEnv, y: num, param: { 'col': this.cols, disease: i } };
  }

  drawLine(id, data) {
    const classname = '.viewMultiline' + id;
    this.ViewMultiline = new MultiLine(data, classname, [0, 500]);
    this.ViewMultiline.render(data);
  }
}
