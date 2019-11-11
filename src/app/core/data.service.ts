import { EventEmitter } from '@angular/core';
import * as d3 from 'd3';

export class DataService {
    cols = ['ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa',
    'daily_precipitation', 'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h'];
    others = ['AQI', 'month', 'day', 'week'];

    ori_disease;
    ori_data;
    ori_corr_pearson;
    ori_corr_mic;
    selected_corr = [];
    // select_dim = [];
    selected_disease = ['K29.500', 'J40.x00', 'E05.900'];
    selected_data = [];

    predict_group = {};

    dataToactive = new EventEmitter<any>();
    diseaseToActive = new EventEmitter<any>();
    predictToActive = new EventEmitter<any>();

    constructor() {
        this.loadData();
        this.loadCorr();
        this.loadPredictionGroup();
    }

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

    // names: 预测的疾病 [],初始化为selected_disease
    // output: {'d1': [keys]}
    loadPredictionGroup() {
        this.selected_disease.forEach( u => {
            this.predict_group[u] = this.cols.concat(this.others);
        });
        this.predictToActive.emit(this.predictToActive);

    }
    getCorrByName(name, type) {
        const corr = [];
        if (type === 'mic') {
            this.ori_corr_mic.forEach(u => {
                const temp = {
                    axis: u['dim'],
                    value: Math.abs(parseFloat(u[name].toFixed(2)))
                };
                corr.push(temp);
            });
        } else if (type === 'pearson') {
            this.ori_corr_pearson.forEach(u => {
                const temp = {
                    axis: u['dim'],
                    value: Math.abs(parseFloat(u[name].toFixed(2)))
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
        names.forEach( (v) => res[v] = []);
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

    addDisease(name) {
        this.selected_disease.push(name);
        this.selected_data = this.filterByName(this.selected_disease);
        this.dataToactive.emit(this.selected_data);
        console.log(this.selected_data);
    }

    addEnv(name) {
        this.selected_disease.push(name);
        this.diseaseToActive.emit(this.selected_disease);
        console.log(this.selected_data);
    }
}
