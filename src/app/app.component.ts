import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  drawerOut: boolean = false;

  toggleDrawer($drawer:any){
    this.drawer.toggle()
  }

  handleDrawerPositionChanged($event: any){
    this.drawerOut = $event
  }
}
