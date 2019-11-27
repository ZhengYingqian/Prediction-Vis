import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class DiseaseService {
    day;
    disease;
    dis_num;

    url = 'http://127.0.0.1:5000';
    // 数据库后端那边  
    url1 = 'http://202.117.54.93:8800';

    constructor(private http: HttpClient) { }

    getDayDiseaseCount(day, disease) {
        const params = { 'dim': [disease], 'start': day, 'stop': this.getEndDay(day, 1), 'normalization': false };
        this.getDisease(params).subscribe(res => {
            this.dis_num = res;
            console.log(res);
        });
    }

    getEndDay(sday, days) {
        const a =  new Date(Date.parse(sday) + 1000 * 60 * 60 * 24 * days);
        return a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate();
    }

    // 获取时间范围内疾病的数据
    // params: {'dim': ['J03.903'], 'start':'2013-1-1', 'stop':'2013-1-2', 'normalization': false}
    // return: { 'Result': {
    //   '2013-01-01'：{'J03.903': 44}
    // }}
    getDisease(params): Observable<any> {
        return this.http.post(this.url1 + '/weather/disease_count', JSON.stringify(params));
    }

}

/**
 * @param Q_startDate 起始日期（格式为：“yyyyMMdd”）
 * @param days 前、后若干天(前若干天,用负整数)
 * @return 某日的前后若干天的日期（格式为：“yyyyMMdd”）
 */
function getNextDate(Q_startDate, days) {
    if (null == Q_startDate) {
        return;
    }
    const dateString = Q_startDate;
    const date = new Date(dateString.substring(0, 4),
        dateString.substring(4, 6) - 1, dateString.substring(6, 8)); // “yyyyMMdd”的字符串转为Date
    date = date - 0 + 1000 * 60 * 60 * 24 * days;
    date = new Date(date);// 前、后若干天的日期

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    const day = date.getDate();
    day = day < 10 ? '0' + day : day;

    const r = '' + year + '' + month + '' + day; // Date转为“yyyyMMdd”的字符串
    return r;
}