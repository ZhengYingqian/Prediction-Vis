import { EventEmitter } from '@angular/core';
import * as d3 from 'd3';

export class DataService {
    ori_disease;
    ori_data;
    selected_disease = ['K29.500'];
    selected_data = [];

    dataToactive = new EventEmitter<any>();
    diseaseToActive = new EventEmitter<any>();

    constructor() {
        this.loadData();
    }

    loadData() {
        d3.csv('assets/icds.csv').then(res => {
            this.ori_data = res;
            this.ori_disease = res;
            this.selected_disease = res.columns.slice(1, 6);
            this.selected_data = this.filterByName(this.selected_disease);
            this.dataToactive.emit(this.selected_data);
            this.diseaseToActive.emit(this.selected_disease);
            // console.log(this.ori_data);
        });
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

    addDisease(name) {
        this.selected_disease.push(name);
        this.selected_data = this.filterByName(this.selected_disease);
        this.dataToactive.emit(this.selected_data);
        console.log(this.selected_data);
    }
}
