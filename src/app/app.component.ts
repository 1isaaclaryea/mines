import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false,
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  drawerOut: boolean = false;

  constructor(private router: Router){

  }

  toggleDrawer($drawer:any){
    this.drawer.toggle()
  }

  handleDrawerPositionChanged($event: any){
    this.drawerOut = $event
  }

  handleRoute(route:string){
    this.router.navigate([route]);
  }
}
