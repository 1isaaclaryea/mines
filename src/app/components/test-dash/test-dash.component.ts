import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as exceljs from "exceljs";
import { DataService } from 'src/app/services/data.service';
import { firstValueFrom, lastValueFrom } from 'rxjs'


@Component({
  selector: 'test-dash',
  templateUrl: './test-dash.component.html',
  styleUrls: ['./test-dash.component.css']
})
export class TestDashComponent implements OnInit, AfterViewInit {
  file!:File;
  arrayBuffer:any;
  fileList: any;

  monthlyData: any;
  summaryChart: any;
  weeklyChart: any;
  dailyChart: any;
  titles: any[] = [];
  
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
  }

  ngOnInit(): void {

  }

  async ngAfterViewInit(): Promise<void> {
    this.summaryChart.options.data[0].dataPoints = await this.dataService.getMonthlyBudget({title: "Dry Tonnes (t)", rn: 8});
    this.summaryChart.render();

    this.dailyChart.options.data[0].dataPoints = await this.dataService.getDailyBudgetForEachDayInMonth({title: "Dry Tonnes (t)", rn: 8}, this.selectedMonth);
    this.dailyChart.render();

    this.weeklyChart.options.data[0].dataPoints = await this.dataService.getWeeklyBudget({title: "Dry Tonnes (t)", rn: 8});
    this.weeklyChart.render();
  }

  getSummaryChartInstance($chart:any){
    this.summaryChart = $chart;
  }

  getWeeklyChartInstance($chart:any){
    this.weeklyChart = $chart;
  }

  getDailyChartInstance($chart:any){
    this.dailyChart = $chart;
  }

  async plotData(_title: any, dataGroup?: any){
    // console.log(_title)
    // this.chart.options.data[0].type = "line";

    if(this.period == "summary"){
      if(dataGroup == "monthly") {
        this.summaryChart.options.data[0].dataPoints = 
        await this.dataService.getMonthlyBudget(_title);
      }
      if(dataGroup == "quarterly") {
        this.summaryChart.options.data[0].dataPoints = 
        await this.dataService.getQuarterlyBudget(_title);
      }
      if(dataGroup == "yearToDate") {
        this.summaryChart.options.data[0].dataPoints = 
        await this.dataService.getYearToDateMonthlyBudget(_title);
      }
      if(dataGroup == "daily") {
        this.summaryChart.options.data[0].dataPoints = 
        await this.dataService.getDailyBudgetForEachMonth(_title);
      }
    }

    if(this.period == "daily"){
      this.summaryChart.options.data[0].dataPoints = 
        await this.dataService.getDailyBudgetForEachDayInMonth(_title, this.selectedMonth);
    }

    if(this.period == "weeklyWeek"){
      this.summaryChart.options.data[0].dataPoints = 
       await this.dataService.getWeeklyBudget(_title);
    }

    // this.chartOptions.title.text = _title.title;
    this.summaryChart.render();
  }

  log($event:any, plotType?:any){
    this.plotData(JSON.parse($event), plotType?plotType:this.summaryType)
  }

  async refreshPlot($event:any, plotType:any){
    switch (plotType) {
      case "summary":
        if(this.summaryType == "monthly") {
          this.summaryChart.options.data[0].dataPoints = 
          await this.dataService.getMonthlyBudget($event);
        }
        if(this.summaryType == "quarterly") {
          this.summaryChart.options.data[0].dataPoints = 
          await this.dataService.getQuarterlyBudget($event);
        }
        if(this.summaryType == "yearToDate") {
          this.summaryChart.options.data[0].dataPoints = 
          await this.dataService.getYearToDateMonthlyBudget($event);
        }
        if(this.summaryType == "daily") {
          this.summaryChart.options.data[0].dataPoints = 
          await this.dataService.getDailyBudgetForEachMonth($event);
        }
        this.summaryChartOptions.title.text = $event.title;
        this.summaryChart.render();
        break

      case "daily":
        this.dailyChart.options.data[0].dataPoints = await this.dataService.getDailyBudgetForEachDayInMonth($event, this.selectedMonth);
        this.dailyChartOptions.title.text = $event.title;
        this.dailyChart.render();
        break;

      case "weeklyWeek":
        this.weeklyChart.options.data[0].dataPoints = await this.dataService.getWeeklyBudget($event);
        this.weeklyChartOptions.title.text = $event.title;
        this.weeklyChart.render();
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
    this.plotData(JSON.parse(title));
  }

  setMonth(title:any, $event: any){
    this.selectedMonth = $event;
    this.plotData(JSON.parse(title));
  }

  plotChart(){
    if(this.summaryChart) this.plotData({title: "Dry Tonnes (t)", rn: 8}, "monthly");
  }

  changeGraph($event:any){
    this.summaryChart.options.data[0].type = $event.target.value;
    this.summaryChart.render();
  }

  changeTheme($event:any){
    // this.chartOptions.theme = $event.target.value;
    this.summaryChart.render();
  }

}
