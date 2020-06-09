import { Component, ElementRef, Renderer2 } from '@angular/core';
import { DataService } from './core/data.service';
import { HttpService } from './core/http.service';
import * as d3 from 'd3';
import { RadarChart } from './share/radarchart';
import { cols } from './share/correlation';
import { MultiLine } from './share/multiline.component';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  cols = ['ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa',
  'daily_precipitation', 'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h'];

  ViewMultiline: MultiLine;
  radar;
  
  data;
  disease = [];
  envCol = [];

  constructor(private dataSer: DataService,
    public el: ElementRef,
    private renderer2: Renderer2,
    private service: HttpService) {
      this.dataSer.diseaseToActive.subscribe(res => {
          console.log(res);
          res.forEach(element => {
            if (cols.indexOf(element) === -1) {
              this.disease.push(element);
            } else {
              this.envCol.push(element);
            }
          });
        // this.getDiseaseCount(res[0]);
        // this.data = this.dataSer.extractDisease(this.disease);
      });
  }

  ngOnInit() {
    this.radar = new RadarChart(this.dataSer);
    this.refresh();
  }

  deleteDim(dim) {
    const index = this.disease.indexOf(dim);
    const ele = this.el.nativeElement.querySelector('.diseaseList' + index);
    this.renderer2.removeChild(this.el.nativeElement.querySelector('.list'), ele);
    // this.el.nativeElement.remove(ele);
    delete this.disease[index];
    this.disease = this.disease.filter(u => u);
    console.log(this.disease);
  }

  refresh() {
    console.log(this.disease);
    // tslint:disable-next-line:no-shadowed-variable
    this.disease.forEach((element, i) => {
      const corrdata = this.dataSer.loadAllcorr(element);
      this.drawRader(i, corrdata);
      const params = {'dim': [element], 'start': '2014-1-1', 'stop': '2015-1-1', 'normalization': false};
      this.service.getDisease(params).subscribe(res => {
        console.log(res);
        const data = res.Result;
        const linedata = [{'name': element, 'values': this.dataSer.getDiseaseCount(data, element)}];
        this.drawLine(i, linedata);
      });
      // const linedata1 = [{'name': element, 'values': this.dataSer.getByName(element)}] ;
      // console.log(linedata1);
      // this.drawLine(i, linedata);
    });
  }

  predict() {
    this.disease.forEach((u, i) => {
      this.service.getPrediction(this.dataSer.getPredicArr(i)).subscribe(res1 => {
        console.log(res1);
        // this.drawLine()
      });
    });
  }

  drawRader(id, data) {
    const w = 200,
      h = 200;

    const colorscale = d3.scaleOrdinal(d3.schemeCategory10);

    // Legend titles
    // const LegendOptions = ['pearson', 'MIC', 'f_regression', 'spearman'];
    const LegendOptions = ['pearson', 'MIC'];

    // const data = this.corr.map(v => {
    //   return v.map((u, i) => ({ 'axis': Dic[cols[i]], 'value': Math.abs(parseFloat(u[0].toFixed(2)))}));
    // });
    // const data = this.dataSer.loadAllcorr(this.disease);
    console.log(data);
    // Options for the Radar chart, other than default
    const mycfg = {
      w: w,
      h: h,
      maxValue: 0.3,
      levels: 6,
      ExtraWidthX: 150
    };

    // Call function to draw the Radar chart
    // Will expect that data is in %'s
    this.radar.draw('.chart' + id, data, mycfg);

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    const svg = d3.select('.chart' + id)
      .selectAll('svg')
      .append('svg')
      .attr('width', w + 300)
      .attr('height', h);

    // Create the title for the legend
    const text = svg.append('text')
      .attr('class', 'title')
      .attr('transform', 'translate(40,0)')
      .attr('x', w - 70)
      .attr('y', 10)
      .attr('font-size', '12px')
      .attr('fill', '#404040')
      .text('correlation');

    // Initiate Legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', 200)
      .attr('transform', 'translate(160,20)');
    // Create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append('rect')
      .attr('x', w - 65)
      .attr('y', function (d, i) { return i * 20; })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d, i) { return colorscale(i); });
    // Create text next to squares
    legend.selectAll('text')
      .data(LegendOptions)
      .enter()
      .append('text')
      .attr('x', w - 52)
      .attr('y', function (d, i) { return i * 20 + 9; })
      .attr('font-size', '11px')
      .attr('fill', '#737373')
      .text(function (d) { return d; });
  }

  drawLine(id, data) {
    const classname = '.viewMultiline' + id;
    this.ViewMultiline = new MultiLine(data, classname, [0, 500]);
    this.ViewMultiline.render(data);
  }
}
