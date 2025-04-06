import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  imports: [],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  constructor(
    private router: Router
  ){
  }

  ngOnInit(){
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }
  }
}
