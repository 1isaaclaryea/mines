import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestDashComponent } from './components/test-dash/test-dash.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path:'', component: TestDashComponent},
  {path:'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
