import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HexBinChart } from './hexbinVis';
import { HexBinColorChart } from './hexbinColor'
@Component({
  selector: 'app-shap-hexbin',
  templateUrl: './shap-hexbin.component.html',
  styleUrls: ['./shap-hexbin.component.css']
})
export class ShapHexbinComponent implements OnInit {

  cols = ['trend', 'yhat_lower', 'yhat_upper', 'trend_lower', 'trend_upper', 'additive_terms', 'additive_terms_lower',
    'additive_terms_upper', 'weekly', 'weekly_lower', 'weekly_upper', 'multiplicative_terms', 'multiplicative_terms_lower',
    'multiplicative_terms_upper', 'yhat', 'min_C_cwt_coefficients', 'max_C_abs_energy', 'max_C_fft_aggregated', 'max_C_number_crossing_m',
    'daily_precipitation_spkt_welch_density', 'daily_precipitation_time_reversal_asymmetry_statistic', 'SO2_autocorrelation', 'SO2_cid_ce',
    'SO2_last_location_of_minimum', 'SO2_spkt_welch_density', 'SO2_time_reversal_asymmetry_statistic', 'NO2_autocorrelation', 'NO2_cid_ce',
    'NO2_spkt_welch_density', 'NO2_time_reversal_asymmetry_statistic', 'CO_cid_ce', 'CO_last_location_of_minimum', 'CO_spkt_welch_density',
    'CO_time_reversal_asymmetry_statistic', 'PM2_5_cid_ce', 'ave_C', 'min_C', 'max_C', 'ave_ws', 'ave_rh', 'ave_hpa', 'daily_precipitation',
    'SO2', 'NO2', 'CO', 'PM2_5', 'PM10', 'O38h', 'AQI', 'month', 'day', 'week'];
  constructor() { }

  ngOnInit() {
    console.log(this.cols.length);
    d3.csv('assets/shxdgr_shapValue.csv').then(res => {
      d3.csv('assets/hybridModelInput.csv').then(ori_data => {
        console.log(res);
        const data = this.getXY(res, ori_data, 'min_C_cwt_coefficients');
        console.log(data);
        const hexbin = new HexBinChart('#hexbin');
        hexbin.chart(data);
        const hexbinColor = new HexBinColorChart('#hexbinColor');
        hexbinColor.chart(data);
      })
    });


  }

  getXY(data, sdata, dim1) {
    return data.map((u, i) => {
      return {
        x: parseInt(u[dim1], 10) + 30,
        y: parseInt(sdata[i][dim1], 10) + 30
      };
    });
  }

  getOrixShapY(data, sdata, dim1, dim2) {
    return data.map((u, i) => {
      return {
        x: parseInt(u[dim1], 10) + 30,
        y: parseInt(sdata[i][dim1], 10) + 30,
        c: parseInt(u[dim2], 10) + 30
      };
    });
  }

}
