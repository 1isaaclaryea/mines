import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestDashComponent } from './components/test-dash/test-dash.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
// import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
// import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

// import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
// import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ChartModule, ChartAllModule, ExportService} from '@syncfusion/ej2-angular-charts';
import { CategoryService, LegendService, TooltipService } from '@syncfusion/ej2-angular-charts';
import { DataLabelService, LineSeriesService} from '@syncfusion/ej2-angular-charts';

import { AreaSeriesService, ColumnSeriesService, StackingColumnSeriesService, StackingAreaSeriesService, RangeColumnSeriesService, ScatterSeriesService, PolarSeriesService, RadarSeriesService, ILoadedEventArgs, SplineSeriesService} from '@syncfusion/ej2-angular-charts'

import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
  declarations: [
    AppComponent,
    TestDashComponent,
    SettingsComponent,
    LoginComponent,
    DataEntryComponent
  ],
  imports: [
    BrowserModule,
    
    ButtonModule,

    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    MatSidenavModule,
    // MatProgressSpinnerModule,
    // MatButtonModule,
    // MatListModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    // MatTooltipModule,
    ChartModule,
    ChartAllModule,
    SpreadsheetAllModule
  ],
  providers: [
    provideAnimationsAsync(),
    AreaSeriesService, 
    LineSeriesService, 
    ExportService, 
    ColumnSeriesService, 
    StackingColumnSeriesService, 
    StackingAreaSeriesService, 
    RangeColumnSeriesService, 
    ScatterSeriesService, 
    PolarSeriesService, 
    CategoryService, 
    RadarSeriesService, 
    SplineSeriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
