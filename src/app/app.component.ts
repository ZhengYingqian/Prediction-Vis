import { Component } from '@angular/core';
import { DataService } from './core/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  data;
  disease;
  keys;
  lines;
  cols = ['ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa',
  'daily_precipitation', 'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h'];
  constructor(private dataSer: DataService) {
      this.dataSer.diseaseToActive.subscribe(res => {
        this.disease = res;
        this.data = this.dataSer.extractDisease(res);
        // console.log(this.data);
      });
  }
}
