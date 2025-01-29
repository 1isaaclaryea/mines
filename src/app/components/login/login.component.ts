import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
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

  selectedDepartment = 12;
  constructor(private router:Router) {
    let localData = localStorage.getItem('selectedDepartmentId');
    if(localData) this.selectedDepartment = this.departments[parseInt(localData)-1].id;
  }

  ngOnInit(): void {
  }

  login(){
    localStorage.setItem("selectedDepartmentId",this.selectedDepartment.toString());
    this.router.navigate(['/data-entry']);
  }

}
