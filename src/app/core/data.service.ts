import { EventEmitter } from '@angular/core';
import * as d3 from 'd3';

export class DataService {
    diseaseGroup = ['J06.002'];
    ori_json;

    diseaseToInactive = new EventEmitter<any>();
    diseaseToActive = new EventEmitter<any>();

    constructor() {
        d3.csv('assets/icds.csv').then( res => {
            this.ori_json = res;
            console.log(this.ori_json);
        });
    }

    addDisease(name) {
        this.diseaseGroup.push(name);
        console.log(this.diseaseGroup);
    }

}
