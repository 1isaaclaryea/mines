import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as exceljs from "exceljs";
import { DataService } from 'src/app/services/data.service';
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { Chart, ChartComponent } from '@syncfusion/ej2-angular-charts';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
    selector: 'test-dash',
    templateUrl: './test-dash.component.html',
    styleUrls: ['./test-dash.component.css'],
    standalone: false
})
export class TestDashComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;
  
  public selectedSection: string = 'cil';
  public sections: string[] = ['cil', 'crushing'];
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
    private router: Router,
    private snackBar: MatSnackBar,
    private budgetService: BudgetService
  ) { }

  async ngOnInit(): Promise<void> {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }
    await this.loadSectionData();
    this.getMonthlyBudget(2025, 6);
  }

  async loadSectionData(): Promise<void> {
    try {
      const todayData = await this.apiService.getTodayDataEntry(this.selectedSection);
      
      // Get parameters for dropdown
      this.parameters = Object.keys(todayData).filter(key => 
        key !== 'timestamp' && 
        key !== 'date' && 
        key !== 'shift' && 
        key !== 'employeeId' && 
        key !== 'comments'
      );
      
      // Set default selected parameter
      if (this.parameters.length > 0) {
        this.selectedParameter = this.parameters[0];
        this.updateChart(todayData[this.selectedParameter].values);
      }
    } catch (error: any) {
      console.error('Error fetching today\'s data:', error);
      if (error?.status === 404) {
        this.snackBar.open('No data available for today', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['white-snackbar']
        });
      }
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
        },
        titleStyle: {
          color: 'white'
        }
      },
      primaryYAxis: {
        title: this.selectedParameter,
        labelStyle: {
          color: 'white'
        },
        titleStyle: {
          color: 'white'
        }
      },
      title: {
        text: this.selectedParameter,
        textStyle: {
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
    const todayData = this.apiService.getTodayDataEntry(this.selectedSection).then(data => {
      this.updateChart(data[this.selectedParameter].values);
    });
  }

  onSectionChange(event: any): void {
    this.selectedSection = event.value;
    this.loadSectionData();
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

  async getCurrentMonthData(): Promise<void> {
    console.log('Fetching current month data');
    try {
      // Get start and end of current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Get data for current month
      const monthData = await this.apiService.getDataEntriesByDateRange('cil', startOfMonth, endOfMonth);

      console.log('Month Data:', monthData);

      // Group data by date and parameter
      const groupedData = monthData.reduce((acc: any, entry: any) => {
        const date = new Date(entry.date).toISOString().split('T')[0];
        
        // Initialize date in accumulator if not exists
        if (!acc[date]) {
          acc[date] = {};
        }

        // Add each parameter's value to the date
        this.parameters.forEach((param: string) => {
          if (entry[param] !== undefined) {
            if (!acc[date][param]) {
              acc[date][param] = [];
            }
            acc[date][param].push(entry[param]);
          }
        });

        return acc;
      }, {});

      // Calculate daily averages for each parameter
      const averages = Object.entries(groupedData).map(([date, values]: [string, any]) => {
        const dayAverages: any = { date };
        
        this.parameters.forEach((param: string) => {
          if (values[param] && values[param].length > 0) {
            const sum = values[param].reduce((a: number, b: number) => a + b, 0);
            dayAverages[param] = sum / values[param].length;
          }
        });

        return dayAverages;
      });

      // Sort by date
      averages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Log results
      console.log('Current Month Data Summary:');
      console.log('Date Range:', startOfMonth.toLocaleDateString(), 'to', endOfMonth.toLocaleDateString());
      console.log('Daily Averages:', averages);

      // Create a more readable table format
      console.table(averages);

    } catch (error) {
      console.error('Error fetching current month data:', error);
    }
  }

  async getMonthlyBudget(year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1): Promise<void> {
    try {
      const budgetData = await firstValueFrom(this.budgetService.getBudgetEntry(year, month));
      
      console.log(`Budget Data for ${month}/${year}:`);
      console.log('Status:', budgetData.status);
      console.log('Created By:', budgetData.createdBy);
      
      // Create a formatted table of the budget data
      const formattedData: any = {};
      
      // Process each category
      Object.entries(budgetData.data).forEach(([category, values]) => {
        console.log(`\n${category.toUpperCase()}:`);
        console.table(values);
        
        formattedData[category] = values;
      });

      // Log the complete formatted data
      console.log('\nComplete Budget Summary:');
      console.table(formattedData);

      // Show success message
      this.snackBar.open('Budget data loaded successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['white-snackbar']
      });

    } catch (error: any) {
      console.error('Error fetching budget data:', error);
      this.snackBar.open(
        error?.status === 404 ? 'No budget data available for this month' : 'Error loading budget data', 
        'Close', 
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['white-snackbar']
        }
      );
    }
  }
}