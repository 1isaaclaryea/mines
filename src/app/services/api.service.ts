import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Auth Methods
  login(credentials: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userSection', response.user.section);
          localStorage.setItem('employeeId', response.user.employeeId);
          localStorage.setItem('userRole', response.user.role);
        }
      })
    );
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.baseUrl}/logout`, {}, { headers: this.getHeaders() })
      );
      // Clear local storage
      localStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if the API call fails
      localStorage.clear();
      throw error;
    }
  }

  // User Management Methods
  async getUsers(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${this.baseUrl}/users`, { headers: this.getHeaders() }));
  }

  async createUser(user: User): Promise<User> {
    return firstValueFrom(this.http.post<User>(`${this.baseUrl}/users`, user, { headers: this.getHeaders() }));
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return firstValueFrom(this.http.patch<User>(`${this.baseUrl}/users/${userId}`, userData, { headers: this.getHeaders() }));
  }


  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    return firstValueFrom(
      this.http.patch<User>(`${this.baseUrl}/users/${userId}/status`, { isActive }, { headers: this.getHeaders() })
    );
  }


  async deleteUser(userId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/users/${userId}`, { headers: this.getHeaders() }));
  }

  async getDataEntries(section: string, date: Date): Promise<any> {
    // Create start and end of day dates
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const params = new HttpParams()
      .set('section', section)
      .set('startDate', startOfDay.toISOString())
      .set('endDate', endOfDay.toISOString());

    return firstValueFrom(
      this.http.get(`${this.baseUrl}/data-entry`, {
        params,
        headers: this.getHeaders()
      })
    );
  }
  

  // Helper methods to transform Excel data
  transformCILPlantData(excelData: any): any {
    return {
      date: new Date(excelData.date),
      shift: excelData.shift?.toLowerCase(),
      employeeId: localStorage.getItem('employeeId'),
      tankNumber: Number(excelData.tankNumber),
      dissolvedOxygen: Number(excelData.dissolvedOxygen),
      ph: Number(excelData.ph),
      density: Number(excelData.density),
      freeNaCN: Number(excelData.freeNaCN),
      leachResidue: Number(excelData.leachResidue),
      comments: excelData.comments
    };
  }

  transformCrushingShiftData(excelData: any): any {
    return {
      date: new Date(excelData.date),
      shift: excelData.shift?.toLowerCase(),
      employeeId: localStorage.getItem('employeeId'),
      crusherFeedTonnage: Number(excelData.crusherFeedTonnage),
      crusherProductTonnage: Number(excelData.crusherProductTonnage),
      operatingTime: Number(excelData.operatingTime),
      delayTime: Number(excelData.delayTime),
      comments: excelData.comments
    };
  }

  transformSAGMillData(excelData: any): any {
    return {
      date: new Date(excelData.date),
      shift: excelData.shift?.toLowerCase(),
      employeeId: localStorage.getItem('employeeId'),
      feedRate: Number(excelData.feedRate),
      powerDraw: Number(excelData.powerDraw),
      millSpeed: Number(excelData.millSpeed),
      bearingPressure: Number(excelData.bearingPressure),
      dilutionWaterFlow: Number(excelData.dilutionWaterFlow),
      cycloneFeedDensity: Number(excelData.cycloneFeedDensity),
      cycloneFeedPressure: Number(excelData.cycloneFeedPressure),
      comments: excelData.comments
    };
  }

  // Data Entry Methods
  async submitDataEntry(employeeId: string, section: string, data: any): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/data-entry`, 
        { employeeId, section, data },
        { headers: this.getHeaders() }
      )
    );
  }

  async approveDataEntry(entryId: string, status: string, supervisorId: string): Promise<any> {
    return firstValueFrom(
      this.http.patch(
        `${this.baseUrl}/data-entry/${entryId}/approve`,
        { status, supervisorId },
        { headers: this.getHeaders() }
      )
    );
  }

  async rejectDataEntry(supervisorId: string): Promise<any> {
    return firstValueFrom(
      this.http.patch(
        `${this.baseUrl}/data-entry/reject`,
        { supervisorId },
        { headers: this.getHeaders() }
      )
    );
  }

  async getTodayDataEntry(section: string): Promise<any> {
    const params = new HttpParams()
      .set('section', section);

    return firstValueFrom(
      this.http.get(`${this.baseUrl}/data-entry/today`, {
        params,
        headers: this.getHeaders()
      })
    ).then(response => {
      // The API returns { message: string, data: any }
      // We're interested in the data property
      return (response as any).data;
    });
  }
}
 