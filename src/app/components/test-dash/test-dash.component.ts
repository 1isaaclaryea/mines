import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as exceljs from "exceljs";
import { DataService } from 'src/app/services/data.service';
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { Chart, ChartComponent } from '@syncfusion/ej2-angular-charts';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';


@Component({
    selector: 'test-dash',
    templateUrl: './test-dash.component.html',
    styleUrls: ['./test-dash.component.css'],
    standalone: false
})
export class TestDashComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;
  
  public chartData: any[] = [];
  public selectedParameter: string = '';
  public parameters: string[] = [];
  public chartOptions: any;
  public palette?: string[] = ["#E94649", "#F6B53F", "#6FAAB0", "#C4C24A"];
  public chartArea?: Object = { background: 'grey'};

  constructor(
    private dataService: DataService, 
    private apiService: ApiService, 
    private httpClient: HttpClient,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const todayData = await this.apiService.getTodayDataEntry('cil');
      
      // Get parameters for dropdown
      this.parameters = Object.keys(todayData).filter(key => key !== 'timestamp');
      
      // Set default selected parameter
      if (this.parameters.length > 0) {
        this.selectedParameter = this.parameters[0];
        this.updateChart(todayData[this.selectedParameter].values);
      }
    } catch (error) {
      console.error('Error fetching today\'s data:', error);
    }
  }

  updateChart(values: any[]): void {
    this.chartData = values.map(item => ({
      x: item.time,
      y: item.value
    }));

    this.chartOptions = {
      primaryXAxis: {
        valueType: 'Category',
        title: 'Time',
        labelStyle: {
          color: 'white'
        }
      },
      primaryYAxis: {
        title: this.selectedParameter,
        labelStyle: {
          color: 'white'
        }
      },
      series: [{
        type: 'Line',
        dataSource: this.chartData,
        xName: 'x',
        yName: 'y',
        width: 2,
        marker: {
          visible: true,
          width: 7,
          height: 7
        }
      }]
    };
  }

  onParameterChange(event: any): void {
    this.selectedParameter = event.value;
    const todayData = this.apiService.getTodayDataEntry('cil').then(data => {
      this.updateChart(data[this.selectedParameter].values);
    });
  }

  async ngAfterViewInit(): Promise<void> {
  }

  refreshPlot(title: string, summaryType: string): void {
    console.log('Refreshing plot with title:', title, 'and summary type:', summaryType);
  }

  exportData(): void {
    console.log('Exporting data');
  }

  printChart(){
    this.chart.print();
  }

  export() {
    const header = {
        content: "Mining company report",
        fontSize: 15,
        x:50,
        y:10
    };

    const footer = {
        content: 'Chart Footer',
        fontSize: 15,
        x:50,
        y:10
    };
    this.chart.exportModule.export('PDF', 'Chart', 1, [this.chart as ChartComponent], undefined, undefined, false, header, footer, false);
  }
  

}
