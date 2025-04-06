import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestDashComponent } from './components/test-dash/test-dash.component';
import { LoginComponent } from './components/login/login.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { AccountComponent } from './components/account/account.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
const routes: Routes = [
  {path:'', component: TestDashComponent},
  {path:'login', component: LoginComponent},
  {path:'data-entry', component: DataEntryComponent},
  {path:'accounts', component: AccountComponent},
  {path:'preferences', component: PreferencesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
