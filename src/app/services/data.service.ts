import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as exceljs from "exceljs";
import { firstValueFrom } from 'rxjs';

export interface TITLE {
  title: string,
  rn: number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _workBook!: exceljs.Workbook;
  private letters: string[] = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
  private numbers: number[] = [0,1,2,3,4,5,6,7,8,9];
  private months: string[] = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

  private backendUrl = "http://localhost:8080/"
  constructor(private http: HttpClient) { }

  public get workBook() : exceljs.Workbook {
    return this._workBook;
  }

  public set workBook(wkBk: exceljs.Workbook) {
    this._workBook = wkBk;
  }

  /**
   * Get the monthly budget data
   * @param {string} field - Row number/ object that contains the field to be plotted
   * @returns Data points to be plotted 
   */
  async getMonthlyBudget(field:TITLE) {
      // const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
      // let dataPoints: { label: string; y: string | number | Date; }[] = [];
      // row.eachCell((cell, cn) => {
      //   if(cn > 1 && cn <= this.getColumnNumberFromLetter("M")){
      //     let dataPoint = { label: this.months[cn-2],  y: cell.result };
      //     dataPoints.push(dataPoint);
      //   } 
      // });
      // console.log(dataPoints)
      // return dataPoints;
      let dataPoints = await firstValueFrom(this.http.post(this.backendUrl+"monthlyBudget",field
      ))
      return dataPoints
  }

  private getColumnNumberFromLetter(letter: string){
   return this.workBook.getWorksheet('BUDGET CALC').getColumn(letter).number
  }

  /**
   * Gets the fields to be plotted. 
   * @returns An array of objects containing field name and row number
   * */
  getFields() {
    return [
      {title: "Dry Tonnes (t)", rn: 8},
      {title: "Crusher Throughput (tph)", rn: 9},
      {title: "Operating Hours (hrs)", rn: 10},
      {title: "Crusher Availability (%)", rn: 11},
      {title: "Crusher Utilization (%)", rn: 12},
      {title: "Dry Tonnes Milled (t)", rn: 14},
      {title: "Tonnes Treated (t)", rn: 15},
      {title: "Mill Throughput (tph)", rn: 16},
      {title: "Mill Availability (%)", rn: 19},
      {title: "Mill Utilization (%)", rn: 20},
      {title: "Assayed Head Grade (g/t)", rn: 23},
      {title: "Reconciled Head Grade (g/t)", rn: 24},
      {title: "Gold Accounted For Grade (g/t)", rn: 25},
      {title: "Feed Sulphur Grade (%)", rn: 26},
      {title: "Residue Grade (g/t)", rn: 27},
      {title: "Gold Recovered - Assayed (oz)", rn: 30},
      {title: "Gold Recovered - Reconciled (oz)", rn: 31},
      {title: "Gold Recovered - Accounted (oz)", rn: 32},
      {title: "Recovery - Reconciled (%)", rn: 33},
      {title: "Recovery - Accounted (%)", rn: 34},
      {title: "Gold Poured (ozs)", rn: 36},
      {title: "Gravity Recovered Au (ozs)", rn: 43},
      {title: "Gold Recovery (%)", rn: 43},
    ]
  }

  async getQuarterlyBudget(field:TITLE) {
    // const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
    // let dataPoints: { label: string; y: string | number | Date; }[] = [];
    // let counter = 1;
    // row.eachCell((cell, cn) => {
    //   if(cn > this.getColumnNumberFromLetter("M") && cn <= this.getColumnNumberFromLetter("Q")){
    //     // modify label
    //     console.log(cell.result)
    //     let dataPoint = { label: this.months[(counter*3)-1],  y: cell.result };
    //     dataPoints.push(dataPoint);
    //     counter++;
    //   } 
    // });
    
    // return dataPoints;

    let dataPoints = await firstValueFrom(this.http.post(this.backendUrl+"quarterlyBudget",field
    ))
    return dataPoints
  }

  async getYearToDateMonthlyBudget(field:TITLE) {
    // const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
    // let dataPoints: { label: string; y: string | number | Date; }[] = [];
    // row.eachCell((cell, cn) => {
    //   if(cn > this.getColumnNumberFromLetter("Q") && cn <= this.getColumnNumberFromLetter("AC")){
    //     let dataPoint = { label: this.months[(cn - this.getColumnNumberFromLetter("Q"))-1],  y: cell.result };
    //     dataPoints.push(dataPoint);
    //   } 
    // });
    // console.log(dataPoints)
    // return dataPoints;

    let dataPoints = await firstValueFrom(this.http.post(this.backendUrl+"yearToDateMonthlyBudget",field
      ))
      return dataPoints
  }

  async getDailyBudgetForEachMonth(field:TITLE) {
    // const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
    // let dataPoints: { label: string; y: string | number | Date; }[] = [];
    // let counter = 1;
    // row.eachCell((cell, cn) => {
    //   if(cn > this.getColumnNumberFromLetter("AC") && cn <= this.getColumnNumberFromLetter("AO")){
    //     let dataPoint = { label: this.months[counter-1],  y: cell.result };
    //     dataPoints.push(dataPoint);
    //     counter++;
    //   } 
    // });
    // return dataPoints;
    let dataPoints = await firstValueFrom(this.http.post(this.backendUrl+"dailyBudgetForEachMonth",field
      ))
      return dataPoints
  }

  async getDailyBudgetForEachDayInMonth(_field:TITLE, _month: string) {
    // const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
    // let dataPoints: { label: string; y: string | number | Date; }[] = [];
    // let colRange = this.getDailyMonthsColums(month);
    // let counter = 1;
    // row.eachCell((cell, cn) => {
    //   if(cn >= this.getColumnNumberFromLetter(colRange[0]) && cn <= this.getColumnNumberFromLetter(colRange[1])){
    //     // using counter for now. Better way will be to show day number and month
    //     let dataPoint = { label: `${counter}`,  y: cell.result };
    //     dataPoints.push(dataPoint);
    //     counter++;

    //     console.log(dataPoint)
    //   } 
    // });
    // return dataPoints;
    let dataPoints = await firstValueFrom(this.http.post(this.backendUrl+"dailyBudgetForEachDayInMonth",{field: _field, month: _month}
      ))
      return dataPoints
  }

  getDailyMonthsColums(month: string){
    switch (month) {
      case "Jan": return ["AP", "BN"]
      case "Feb": return ["BO", "CS"]
      case "Mar": return ["CT", "DU"]
      case "Apr": return ["DV", "EZ"]
      case "May": return ["FA", "GD"]
      case "Jun": return ["GE", "HI"]
      case "Jul": return ["HJ", "IM"]
      case "Aug": return ["IN", "JR"]
      case "Sep": return ["JS", "KW"]
      case "Oct": return ["KX", "MA"]
      case "Nov": return ["MB", "NF"]
      case "Dec": return ["NG", "OP"]
      default:
        return ["AP", "BN"]
    }
  }


  // To be clarified
  getWeeklyBudgetForEachDayInMonth(field:TITLE, month: string) {
    const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
    let dataPoints: { label: string; y: string | number | Date; }[] = [];
    let colRange = this.getDailyMonthsColums(month);
    let counter = 0;
    row.eachCell((cell, cn) => {
      if(cn == this.getColumnNumberFromLetter(colRange[0]) && cn <= this.getColumnNumberFromLetter(colRange[1])){
        let dataPoint = { label: this.months[cn-2],  y: cell.result };
        dataPoints.push(dataPoint);
      } 
    });

    return dataPoints;
  }

  async getWeeklyBudget(field:TITLE) {
    // const row = this.workBook.getWorksheet('BUDGET CALC').getRow(field.rn);
    // let dataPoints: { label: string; y: string | number | Date; }[] = [];
    // let counter = 1;
    // row.eachCell((cell, cn) => {
    //   if(cn >= this.getColumnNumberFromLetter("ACR") && cn <= this.getColumnNumberFromLetter("AER")){
    //     let dataPoint = { label: counter.toString(),  y: cell.result };
    //     dataPoints.push(dataPoint);
    //     counter++;
    //   } 
    // });
    // // console.log(this.workBook.getWorksheet('BUDGET CALC').getColumn("A").number);

    // return dataPoints;
    let dataPoints = await firstValueFrom(this.http.post(this.backendUrl+"weeklyBudget",field
      ))
      return dataPoints
  }
}
