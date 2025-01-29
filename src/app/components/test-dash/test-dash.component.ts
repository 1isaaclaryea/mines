import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as exceljs from "exceljs";
import { DataService } from 'src/app/services/data.service';
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { Chart, ChartComponent } from '@syncfusion/ej2-angular-charts';


@Component({
    selector: 'test-dash',
    templateUrl: './test-dash.component.html',
    styleUrls: ['./test-dash.component.css'],
    standalone: false
})
export class TestDashComponent implements OnInit, AfterViewInit {
  public chartData: Object[];
  
  public summaryXAxis?: Object;
  public dailyXAxis?: Object;
  public weeklyXAxis?: Object;
  public summaryYAxis?: Object;
  public dailyYAxis?: Object;
  public weeklyYAxis?: Object;


  @ViewChild('summaryChart') summaryChartComponent?: ChartComponent;
  @ViewChild('dailyChart') dailyChartComponent?: ChartComponent;
  @ViewChild('weeklyChart') weeklyChartComponent?: ChartComponent;


  file!:File;
  arrayBuffer:any;
  fileList: any;

  monthlyData: any;
  summaryChart: any;
  weeklyChart: any;
  dailyChart: any;
  titles: any[] = [];

  dataPoints:any;
  summaryDataPoints: any;
  dailyDataPoints: any;
  weeklyDataPoints: any;

  // later change to Enum/interface for period
  period: "summary" | "daily" | "weeklyMonth" | "weeklyWeek" = "summary";
  summaryType: "monthly" | "quarterly" | "yearToDate" | "daily" = "monthly";
  selectedMonth:
    "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec"
    = "Jan";

  summaryChartOptions = {
    theme:"dark2",
    title: {
      text: "Dry tonnes"
    },
    data: [{
    type: "line",
    dataPoints: [  ]
    }]
  }

  dailyChartOptions = {
    theme:"dark2",
    title: {
      text: "Dry tonnes"
    },
    data: [{
    type: "line",
    dataPoints: [  ]
    }]
  }

  weeklyChartOptions = {
    theme:"dark2",
    title: {
      text: "Dry tonnes"
    },
    data: [{
    type: "line",
    dataPoints: [  ]
    }]
  }

  constructor(private dataService: DataService, private httpClient: HttpClient) { 
    this.titles = this.dataService.getFields();
    this.chartData = [
      { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
      { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
      { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
      { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
      { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
      { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
    ];
    this.summaryXAxis = {
      interval: 1,
      valueType: 'Category',
    };
    this.summaryYAxis =
    {
      title: 'Dry Tonnes (T)',
    };
  }

  async ngOnInit(): Promise<void> {
    this.dataPoints = await this.dataService.getMonthlyBudget({title: "Dry Tonnes (t)", rn: 8});
    this.summaryDataPoints = await this.dataService.getMonthlyBudget({title: "Dry Tonnes (t)", rn: 8});
    this.dailyDataPoints = await this.dataService.getDailyBudgetForEachDayInMonth({title: "Dry Tonnes (t)", rn: 8}, this.selectedMonth);
    this.weeklyDataPoints = await this.dataService.getWeeklyBudget({title: "Dry Tonnes (t)", rn: 8});
    // console.log(this.dailyDataPoints)
    // console.log(this.weeklyDataPoints)
  }

  async ngAfterViewInit(): Promise<void> {
    // this.summaryChart.options.data[0].dataPoints = await this.dataService.getMonthlyBudget({title: "Dry Tonnes (t)", rn: 8});
    // this.summaryChart.render();

    // this.dailyChart.options.data[0].dataPoints = await this.dataService.getDailyBudgetForEachDayInMonth({title: "Dry Tonnes (t)", rn: 8}, this.selectedMonth);
    // this.dailyChart.render();

    // this.weeklyChart.options.data[0].dataPoints = await this.dataService.getWeeklyBudget({title: "Dry Tonnes (t)", rn: 8});
    // this.weeklyChart.render();

    // console.log(this.dataPoints)
  }

  getSummaryChartInstance($chart:any){
    console.log("Initialized")
    this.summaryChart = $chart;
  }

  getWeeklyChartInstance($chart:any){
    this.weeklyChart = $chart;
  }

  getDailyChartInstance($chart:any){
    this.dailyChart = $chart;
  }

  export() {
    const header = {
        content: 'Chart Header',
        fontSize: 15
    };

    const footer = {
        content: 'Chart Footer',
        fontSize: 15,
    };
    this.summaryChartComponent?.exportModule.export('PDF', `${new Date().toJSON().slice(0, 10)}-Report`, 'Landscape' as any , [this.summaryChartComponent as Chart, this.dailyChartComponent as Chart, this.weeklyChartComponent as Chart], undefined, undefined, true, undefined, undefined, true);
  }

  async plotData(_title: any, dataGroup?: any){
    // console.log(_title)
    // this.chart.options.data[0].type = "line";

    if(this.period == "summary"){
      if(dataGroup == "monthly") {
        // this.summaryChart.options.data[0].dataPoints = 
        // await this.dataService.getMonthlyBudget(_title);
      }
      if(dataGroup == "quarterly") {
        // this.summaryChart.options.data[0].dataPoints = 
        // await this.dataService.getQuarterlyBudget(_title);
      }
      if(dataGroup == "yearToDate") {
        // this.summaryChart.options.data[0].dataPoints = 
        // await this.dataService.getYearToDateMonthlyBudget(_title);
      }
      if(dataGroup == "daily") {
        // this.summaryChart.options.data[0].dataPoints = 
        // await this.dataService.getDailyBudgetForEachMonth(_title);
      }
    }

    if(this.period == "daily"){
      // this.summaryChart.options.data[0].dataPoints = 
      //   await this.dataService.getDailyBudgetForEachDayInMonth(_title, this.selectedMonth);
    }

    if(this.period == "weeklyWeek"){
      // this.summaryChart.options.data[0].dataPoints = 
      //  await this.dataService.getWeeklyBudget(_title);
    }

    // this.chartOptions.title.text = _title.title;
    // this.summaryChart.render();
  }

  log($event:any, plotType?:any){
    // this.plotData(JSON.parse($event), plotType?plotType:this.summaryType)
  }

  async refreshPlot($event:any, plotType:any){
    let plotParam = JSON.parse($event);
    switch (plotType) {
      case "summary":
        if(this.summaryType == "monthly") {
          console.log(await this.dataService.getMonthlyBudget($event));
          this.summaryDataPoints = await this.dataService.getMonthlyBudget($event);
          // this.summaryChart.options.data[0].dataPoints = 
          // await this.dataService.getMonthlyBudget(plotParam);
          
        }
        if(this.summaryType == "quarterly") {
          // this.summaryChart.options.data[0].dataPoints = 
          // await this.dataService.getQuarterlyBudget(plotParam);
          console.log(this.dataService.getQuarterlyBudget(plotParam));
          this.summaryDataPoints = await this.dataService.getQuarterlyBudget(plotParam);

        }
        if(this.summaryType == "yearToDate") {
          // this.summaryChart.options.data[0].dataPoints = 
          // await this.dataService.getYearToDateMonthlyBudget(plotParam);
          console.log(this.dataService.getYearToDateMonthlyBudget(plotParam));
          this.summaryDataPoints = await this.dataService.getYearToDateMonthlyBudget(plotParam);

        }
        if(this.summaryType == "daily") {
          // this.summaryChart.options.data[0].dataPoints = 
          // await this.dataService.getDailyBudgetForEachMonth(plotParam);
          console.log(this.dataService.getDailyBudgetForEachMonth(plotParam));
          this.summaryDataPoints = await this.dataService.getDailyBudgetForEachMonth(plotParam);

        }
        // this.summaryChartOptions.title.text = plotParam.title;
        // this.summaryChart.render();
        break;

      case "daily":
        // this.dailyChart.options.data[0].dataPoints = await this.dataService.getDailyBudgetForEachDayInMonth(plotParam, this.selectedMonth);
        this.dailyDataPoints = await this.dataService.getDailyBudgetForEachDayInMonth(plotParam, this.selectedMonth);
        // this.dailyChartOptions.title.text = plotParam.title;
        // this.dailyChart.render();
        break;

      case "weeklyWeek":
        // this.weeklyChart.options.data[0].dataPoints = await this.dataService.getWeeklyBudget(plotParam);
        this.weeklyDataPoints = await this.dataService.getWeeklyBudget(plotParam);
        // this.weeklyChartOptions.title.text = plotParam.title;
        // this.weeklyChart.render();
        break;
    }
  }

  changeSummaryType($event: any){
    this.summaryType = $event;
  }

  async loadFile($event: any, path:string){
    const wb = new exceljs.Workbook();
    let fileReader = new FileReader();  
    let fileReader1 = new FileReader();  

    if(!$event){
      let fileData = await lastValueFrom(this.httpClient.get(path, {responseType: "blob"}))
      console.log(fileData)
      fileReader1.onload = (async () => {
        console.log(fileData)
        fileReader1.readAsArrayBuffer(fileData);

        this.arrayBuffer = fileReader1.result;   
        console.log(this.arrayBuffer) 
        var dataBuffer = new Uint8Array(this.arrayBuffer);    
        console.log(dataBuffer)
        let workBook = await wb.xlsx.load(dataBuffer);
        this.dataService.workBook = workBook;
        this.plotData({title: "Dry Tonnes (t)", rn: 8}, "monthly");
        console.log("File loaded successfully!");
      })
    }
    else{
      fileReader.onload = (async () => {    
        this.file = $event.target.files[0];   
        fileReader.readAsArrayBuffer(this.file);

        this.arrayBuffer = fileReader.result;    
        var data = new Uint8Array(this.arrayBuffer);    

        let workBook = await wb.xlsx.load(data);
        this.dataService.workBook = workBook;
        this.plotData({title: "Dry Tonnes (t)", rn: 8}, "monthly");
        console.log("File loaded successfully!");
    })
    }    
  }

  setPeriod($event: any, title?:any){
    this.period = $event.target.value;
    // this.plotData(JSON.parse(title));
  }

  setMonth(title:any, $event: any){
    this.selectedMonth = $event;
    // this.refreshPlot(JSON.parse(title), "monthly");
  }

  plotChart(){
    // if(this.summaryChart) this.plotData({title: "Dry Tonnes (t)", rn: 8}, "monthly");
  }

  changeGraph($event:any){
    // this.summaryChart.options.data[0].type = $event.target.value;
    // this.summaryChart.render();
  }

  changeTheme($event:any){
    // this.chartOptions.theme = $event.target.value;
    // this.summaryChart.render();
  }

}
