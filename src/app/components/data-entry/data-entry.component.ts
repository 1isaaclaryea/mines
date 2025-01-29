import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
    selector: 'app-data-entry',
    templateUrl: './data-entry.component.html',
    styleUrls: ['./data-entry.component.css'],
    standalone: false
})
export class DataEntryComponent implements OnInit, OnDestroy {
  fileData?: Subscription;
  @ViewChild('spreadsheet') public spreadsheetObj?: SpreadsheetComponent;
  created () {
    let selectedId = localStorage.getItem("selectedDepartmentId")
    if(selectedId == null) selectedId='12';
    this.fileData = this.httpClient.get(`assets/${this.departments[parseInt(selectedId)-1].name}.xlsx`, { responseType: "blob" })
    .subscribe((data) => {
      console.log(data);
      let _file = new File([data], `${this.departments[parseInt(selectedId)-1].name}.xlsx`); //convert the blob into file
      console.log(_file)
      if(_file){
        this.spreadsheetObj!.open({ file: _file }); // open the file into Spreadsheet
        this.spreadsheetObj!.setRowHeight(20);
      }
    });
  }

  departments: {id:number, name:string}[] = [
    {id:1, name:"Acacia"},
    {id:2, name:"ElutionCircuit"},
    {id:3, name:"ElutionCircuitNew"},
    {id:4, name:"Flotation"},
    {id:5, name:"FlotationConcentrateThickener"},
    {id:6, name:"FlotationConcentrateThickenerRegrindMill"},
    {id:7, name:"KNelson"},
    {id:8, name:"Milling"},
    {id:9, name:"OxideCrusher"},
    {id:10, name:"OxygenSparginMonitoring"},
    {id:11, name:"PlantDowntime"},
    {id:12, name:"PrimaryCrusher"},
    {id:13, name:"PrimaryCrusherDowntime"},
    {id:14, name:"Reagent"},
    {id:15, name:"RegenKiln"},
    {id:16, name:"Sewage"},
    {id:17, name:"SteelBalls"},
    {id:18, name:"Tank01MonitoringParameters"}
  ];


  private httpClient: HttpClient;
  constructor(http: HttpClient) { 
    this.httpClient = http;
  }

  private getFile(){
    return lastValueFrom(this.httpClient.get('assets/BDATA.xlsx', { responseType: 'blob' }))
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(){
    this.fileData?.unsubscribe();
  }

 

}
