import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url = 'http://127.0.0.1:5000';
  datas = {
    'clinical': '/cdata', // 门诊数据
    'air': '/adata', // 获取空气质量数据
    'all': '/tdata', // 获取所有数据
    'weather': '/wdata', // 获取天气数据
    'norm': '/norm',
    'envdata': '/envdata' // 获取2013-2018 环境数据
  };
  api = 'http://localhost:5000';
  constructor(private http: HttpClient) { }

  getData(type) {
    return this.http.get(this.api + this.datas[type]);
  }

  // 获取时序数据
  getRes(partArr: any): Observable<any> {
    partArr = ['儿科门诊', '妇科门诊', '耳鼻喉科门诊'];
    const params = JSON.stringify({ 'part': partArr });
    return this.http.post(this.url + '/data', params, {headers: {'Content-Type': 'application/json'}});
    // .do( () => {})
    // .catch(res => {
    //     console.log(res);
    //     return res
    //   })
  }
  // 获取特征

  // 获取相似度

  // 获取预测模型

  // 读取json数据
  loadJson(file): Observable<any> {
    return this.http.get(file);
  }
}
