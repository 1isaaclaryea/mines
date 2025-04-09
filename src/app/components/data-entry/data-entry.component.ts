import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApproveDialogComponent } from '../approve-dialog/approve-dialog.component';
import { CellModel, getCell, SpreadsheetComponent, workbookReadonlyAlert } from '@syncfusion/ej2-angular-spreadsheet';
import { DataService } from 'src/app/services/data.service';
import * as ExcelJS from 'exceljs';


@Component({
    selector: 'app-data-entry',
    templateUrl: './data-entry.component.html',
    styleUrls: ['./data-entry.component.css'],
    standalone: false
})
export class DataEntryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('spreadsheet') public spreadsheetObj!: SpreadsheetComponent;
  fileData?: Subscription;
  selectedShift: 'day' | 'night' = 'day';
  isLoading = false;
  excelData: any[] = [];
  selectedSection: string | null = null;
  dataStatus: 'approved' | 'pending' | 'rejected' | null = "pending";
  isSupervisor = false;
  openUrl: string = "";
  userSection: string | null = "";
  employeeId: string | null = "";
  alphabets = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
  private currentEntryId: string | null = null;
  private workbook: any;
  baseFile$: Observable<Blob>;
  baseFileSubscription?: Subscription;
  tmpFileData: any;

  sections: {id:number, name:string, type: 'cil' | 'crushing' | 'sag'}[] = [
    {id:1, name:"CIL Plant Monitoring", type: 'cil'},
    {id:2, name:"Crushing Shift Tonnes", type: 'crushing'},
    {id:3, name:"SAG01 Mill", type: 'sag'}
  ];

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) { 
    this.isSupervisor = localStorage.getItem("userRole") === "supervisor";
    this.userSection = localStorage.getItem("userSection");
    this.employeeId = localStorage.getItem("employeeId");

    let sectionId = this.sections.find((section) => {return (section.type == this.userSection) ? section.id : undefined})?.id;
    this.baseFile$ = this.dataService.getFileData$(sectionId!);
  }

  ngOnInit() {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }
    this.getInitialWorkbookData();    
    // setTimeout(this.loadExistingData,1000*60*20);
    // this.loadExistingData();
  }

  async ngAfterViewInit(): Promise<void> {
    // this.loadExistingData();
  }

  ngOnDestroy() {
    this.fileData?.unsubscribe();
    this.baseFileSubscription?.unsubscribe();
  }

  // Entry point: Modify for submission to take entry for 12 hour shifts
  private getTimeSlots(): string[] {
    const currentHour = new Date().getHours();
    const timeSlots: string[] = [];
    let startHour: number;
    console.log(currentHour)
    if (currentHour >= 6 && currentHour < 18) {
      startHour = 6;  // 6 AM - 6 PM
    } else if (currentHour >= 18 && currentHour < 24) {
      startHour = 18; // 6 PM - 12 AM
    } else {
      startHour = 0;  // 12 AM
    }

    for (let i = 0; i < 13; i++) {
      const hour = (startHour + i) % 24;
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return timeSlots;
  }

  async getInitialWorkbookData() {
    this.baseFileSubscription = this.baseFile$.subscribe({
      next: (data) => {
        this.tmpFileData = data;
       
      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => {
        // check if these have to be deleted
        let file: File = new File([this.tmpFileData], 'Worksheet.xlsx');
        // this.updateTimeSlots(file);
        this.loadExistingData(file);
      }
    })
  }

  private updateTimeSlots(file: File) {
    const timeSlots = this.getTimeSlots();
    // const sheet = this.workbook.getActiveSheet();
    let fileR: File;
    // Update cells C6 to C11 with new time values
   

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return reader.onload = async () => {
      const buffer = reader.result as any;
      const workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx
          .load(buffer);
        const worksheet = workbook.worksheets[0];
        timeSlots.forEach((time, index) => {
          // sheet.setValue(6 + index, 2, time); // Column C = 2 (0-based)
          worksheet.getCell(this.alphabets[3] + (index + 7).toString()).value = time;
          workbook.xlsx.writeBuffer().then((buffer_2: any) => {
            const blob = new Blob([buffer_2], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fileR = new File([blob], 'TmpWorksheet1.xlsx');
            this.spreadsheetObj!.open({ file: fileR });
          });
          return fileR;
        });
      } catch (error) {
        console.log(error);
      }
        // return fileR;
      }
    
  }

  private async loadExistingData(baseFile: File): Promise<any> {
    // console.log("Loading data...");
    let fileR: File;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const response = await this.apiService.getDataEntries(
        localStorage.getItem('userSection')!,
        today
      );
      // console.log(response)
      if (response.length > 0) {
        console.log("Loading data...");
        this.dataStatus = response[0].status;
        console.log(this.dataStatus);
        this.currentEntryId = response[0]._id;
        const data = response[0].data;

        const reader = new FileReader();
        reader.readAsArrayBuffer(baseFile);
        reader.onload = () => {
          const buffer = reader.result as any;
          const workbook = new ExcelJS.Workbook();
          workbook.xlsx
            .load(buffer)
            .then(async () => {
              const worksheet = workbook.worksheets[0];
              const timeSlots = this.getTimeSlots();
              console.log(timeSlots)
              timeSlots.forEach((time, index) => {
                worksheet.getCell(this.alphabets[2] + (index + 7).toString()).value = time;
              });
              
              Object.keys(data).forEach((objectName, colIndex) => {
                if(data[objectName].values) {
                  const values = data[objectName].values;
                  values.forEach((entry: any) => {
                    // consider using get time slots function
                    // const rowIndex = ["6","7","8","9","10","11","12","13","14","15","16","17","18"].indexOf(entry.time);
                    const rowIndex = this.getTimeSlots().indexOf(entry.time);
                    if (rowIndex !== -1) {
                      worksheet.getCell(this.alphabets[colIndex+3]+(rowIndex+7).toString()).value = entry.value;
                    }
                  });
                }
              });
              workbook.xlsx.writeBuffer().then((buffer: any) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let file1: File = new File([blob], 'Worksheet1.xlsx');
                this.spreadsheetObj!.open({ file: file1 });
              });

            })
            .catch((error) => {
              console.log(error)
            });
          }
      }
      else {
        const reader = new FileReader();
        reader.readAsArrayBuffer(baseFile);
        reader.onload = () => {
          const buffer = reader.result as any;
          const workbook = new ExcelJS.Workbook();
          workbook.xlsx
            .load(buffer)
            .then(async () => {
              const worksheet = workbook.worksheets[0];
              const timeSlots = this.getTimeSlots();
              // console.log(timeSlots)
              timeSlots.forEach((time, index) => {
                worksheet.getCell(this.alphabets[2] + (index + 7).toString()).value = time;
              });
            }
            
            )}
            
        this.spreadsheetObj!.open({ file: baseFile });
      }
    } catch (error) {
      console.error('Error fetching existing data:', error);
      return null;
    }
  }

  async submitData() {
    this.isLoading = true;
    try {
      const timeSlots = this.getTimeSlots();
      const data: { [key: string]: { values: { time: string; value: number }[] } } = {};
      
      const objectNames = [
        'SOLN Au (ppm)', 
        '% SOLIDS', 
        'pH', 
        'CN CONC', 
        'DO (mg/L)', 
        'CAR CONC(g/L)'
      ];

      // Collect data from spreadsheet
      objectNames.forEach((objectName, colIndex) => {
        data[objectName] = { values: [] };
        // CIL takes data in a two hour interval. Let them know that they only need to enter for those
        // two hour intervals. The rest should go in as zero. Later write logic to delete these values since it can 
        // affect forecasting
        // consider using get time slots function
          this.getTimeSlots().forEach((time, rowIndex) => {
          const sheet = this.spreadsheetObj.getActiveSheet();
          let cell: CellModel = getCell(6 + rowIndex, 3 + colIndex, sheet);
          // To get the formatted cell value, specify the cell model.
          console.log(this.spreadsheetObj.getDisplayText(cell));
          const cellValue = this.spreadsheetObj.getDisplayText(cell)
          
          if (cellValue !== null && cellValue !== undefined) {
            data[objectName].values.push({
              time,
              value: Number(cellValue)
            });
          }
        });
      });
      console.log(data)
      // Submit to API
      await this.apiService.submitDataEntry(this.employeeId!, this.userSection!, data);
      this.showMessage('Data submitted successfully');
      this.dataStatus = 'pending';
    } catch (error) {
      console.error('Error submitting data:', error);
      this.showMessage('Error submitting data');
    } finally {
      this.isLoading = false;
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  async approveData() {
    if (!this.currentEntryId) return;
    console.log(this.currentEntryId)
    try {
      await this.apiService.approveDataEntry(this.currentEntryId, 'approved', this.employeeId!);
      this.dataStatus = 'approved';
      this.showMessage('Data approved successfully');
    } catch (error) {
      console.error('Error approving data:', error);
      this.showMessage('Error approving data');
    }
  }

  async rejectData() {
    if (!this.currentEntryId) return;
    console.log(this.currentEntryId)
    try {
      await this.apiService.approveDataEntry(this.currentEntryId, 'pending', this.employeeId!);
      this.dataStatus = 'pending';
      this.showMessage('Data rejected successfully');
    } catch (error) {
      console.error('Error rejecting data:', error);
      this.showMessage('Error rejecting data');
    }
  }
}
