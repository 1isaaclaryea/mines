import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ApiService } from './services/api.service';
import { registerLicense } from '@syncfusion/ej2-base';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false,
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  drawerOut: boolean = false;

  constructor(private router: Router, private apiService: ApiService){

  }

  ngOnInit() {
    // Register license at component level
    registerLicense(environment.syncfusionLicenseKey);
    
  }

  toggleDrawer($drawer:any){
    this.drawer.toggle()
  }

  handleDrawerPositionChanged($event: any){
    this.drawerOut = $event
  }

  handleRoute(route:string){
    // implement logout functionality
    this.router.navigate([route]);
  }

  get isAdmin(): boolean {
    return localStorage.getItem('userIsAdmin') === 'true';
  }

  logout(){
    this.apiService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
