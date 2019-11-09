import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './material-module';
import { AppComponent } from './app.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { DataSelectionComponent } from './data-selection/data-selection.component';
import { SunburstComponent } from './sunburst/sunburst.component';
import { FeaturesComponent } from './features/features.component';
import { RadarComponent } from './radar/radar.component';

import {HttpService} from './core/http.service';
import { DataService } from './core/data.service';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  declarations: [
    AppComponent,
    TimeSeriesComponent,
    DataSelectionComponent,
    SunburstComponent,
    FeaturesComponent,
    RadarComponent,
    OverviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [HttpService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
