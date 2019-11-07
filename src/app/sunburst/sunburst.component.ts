import { Component, OnInit } from '@angular/core';
import {Sunburst} from '../share/sunburst';
import {HttpService} from '../core/http.service';
import { DataService } from '../core/data.service';

@Component({
  selector: 'app-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrls: ['./sunburst.component.css']
})
export class SunburstComponent implements OnInit {

  constructor(private service: HttpService,
    private dataSer: DataService) { }

  ngOnInit() {
    this.drawSunburst();
  }

  drawSunburst() {
    this.service.loadJson('assets/count.json')
    .subscribe(data => {
      // console.log(data);
      const sunburst = new Sunburst(this.dataSer);
      sunburst.chart(data);
    });
  }

}
