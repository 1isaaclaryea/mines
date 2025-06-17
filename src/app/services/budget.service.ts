import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetEntry } from '../interfaces/budgetEntry';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budget`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Create a new budget entry
  createBudgetEntry(year: number, month: number, data: BudgetEntry['data']): Observable<BudgetEntry> {
    return this.http.post<BudgetEntry>(this.apiUrl, { year, month, data }, { headers: this.getHeaders() });
  }

  // Get budget entry for specific month
  getBudgetEntry(year: number, month: number): Observable<BudgetEntry> {
    return this.http.get<BudgetEntry>(`${this.apiUrl}/${year}/${month}`, { headers: this.getHeaders() });
  }

  // Get all entries for a year
  getYearlyBudget(year: number): Observable<BudgetEntry[]> {
    return this.http.get<BudgetEntry[]>(`${this.apiUrl}/${year}`, { headers: this.getHeaders() });
  }

  // Update budget entry
  updateBudgetEntry(year: number, month: number, data: Partial<BudgetEntry>): Observable<BudgetEntry> {
    return this.http.put<BudgetEntry>(`${this.apiUrl}/${year}/${month}`, data, { headers: this.getHeaders() });
  }

  // Delete budget entry
  deleteBudgetEntry(year: number, month: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${year}/${month}`, { headers: this.getHeaders() });
  }

  // Update budget entry status
  updateBudgetStatus(year: number, month: number, status: BudgetEntry['status']): Observable<BudgetEntry> {
    return this.http.put<BudgetEntry>(`${this.apiUrl}/${year}/${month}`, { status }, { headers: this.getHeaders() });
  }
}
