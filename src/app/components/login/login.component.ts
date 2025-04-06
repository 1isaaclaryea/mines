import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {
  departments: {id:number, name:string}[] = [
    {id:1, name:"CIL Plant Monitoring"},
    {id:2, name:"Crushing Shift Tonnes"},
    {id:3, name:"SAG01 Mill"}
  ]

  selectedDepartment = 1;
  constructor(private router:Router, private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  async login(email: string, password: string){
    try {
      const response = await firstValueFrom(this.apiService.login({email, password}));
      localStorage.setItem('token', response.token);
      localStorage.setItem('userSection', response.user.section);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userIsAdmin', response.user.isAdmin);
      localStorage.setItem('userId', response.user._id);
      if (response.user.role === 'admin') {
        this.router.navigate(['/accounts']);
      } else {
        this.router.navigate(['/data-entry']); 
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.snackBar.open('Invalid email or password', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

}
