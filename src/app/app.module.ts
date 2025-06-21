import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestDashComponent } from './components/test-dash/test-dash.component';
import { BrowserAnimationsModule as AppBrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material Imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { AccountComponent } from './components/account/account.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AreaSeriesService, ColumnSeriesService, StackingColumnSeriesService, StackingAreaSeriesService, RangeColumnSeriesService, ScatterSeriesService, PolarSeriesService, RadarSeriesService, ILoadedEventArgs, SplineSeriesService, CategoryService, ExportService, LineSeriesService, ChartAllModule, ChartModule} from '@syncfusion/ej2-angular-charts'

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ApproveDialogComponent } from './components/approve-dialog/approve-dialog.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { BudgetEntryComponent } from './components/budget-entry/budget-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    TestDashComponent,
    SettingsComponent,
    LoginComponent,
    DataEntryComponent,
    AccountComponent,
    ApproveDialogComponent,
    BudgetEntryComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppBrowserAnimationsModule,
    CommonModule,
    MatSnackBarModule,
    // Material Modules
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatDatepickerModule,
    // Other Modules
    DropDownListModule,
    SpreadsheetAllModule,
    ChartModule,
    ChartAllModule
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
    SplineSeriesService,
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
