import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApproveDialogComponent } from '../approve-dialog/approve-dialog.component';
import { CellModel, getCell, SpreadsheetComponent, workbookReadonlyAlert, OpenOptions } from '@syncfusion/ej2-angular-spreadsheet';
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
  selectedSection: {id:number, name:string, type: 'cil' | 'crushing' | 'sag'} | null = this.sections[0]; // Default to first section
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
    // Configure Syncfusion to work offline
    if (this.spreadsheetObj) {
      this.spreadsheetObj.openUrl = '';
      this.spreadsheetObj.saveUrl = '';
    }
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
    console.log('🔍 Starting getInitialWorkbookData...');
    console.log('📁 Selected section:', this.selectedSection);
    this.isLoading = true;
    
    this.baseFileSubscription = this.baseFile$.subscribe({
      next: (data) => {
        console.log('✅ File data received:', data);
        console.log('📊 File size:', data.size, 'bytes');
        this.tmpFileData = data;
       
      },
      error: err => {
        console.error('❌ Observable emitted an error: ' + err);
        console.error('🔗 Check if backend is running on https://mines-backend1-production.up.railway.app');
        this.isLoading = false;
      },
      complete: () => {
        console.log('🏁 File observable completed, creating File object...');
        // check if these have to be deleted
        let file: File = new File([this.tmpFileData], 'Worksheet.xlsx');
        console.log('📄 Created file:', file.name, 'Size:', file.size);
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
    reader.onload = async () => {
      const buffer = reader.result as any;
      const workbook = new ExcelJS.Workbook();
      try {
        workbook.xlsx
          .load(buffer)
          .then(
        );
        const worksheet = workbook.worksheets[0];
        timeSlots.forEach((time, index) => {
          // sheet.setValue(6 + index, 2, time); // Column C = 2 (0-based)
          worksheet.getCell(this.alphabets[2] + (index + 7).toString()).value = time;
          workbook.xlsx.writeBuffer().then((buffer_2: any) => {
            const blob = new Blob([buffer_2], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fileR = new File([blob], 'TmpWorksheet1.xlsx');
          });
        });
        this.spreadsheetObj!.open({ file: fileR });
      } catch (error) {
        console.log(error);
      }
        // return fileR;
      }
    
  }
  private findObjectNamePosition(worksheet: ExcelJS.Worksheet, objectName: string): { row: number; col: number } | null {
    let position = null;
    
    // Search through first 10 rows and columns for the object name
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 10; col++) {
        const cell = worksheet.getCell(row, col);
        // console.log("object name:", objectName, "cell value:", cell.value);
        if (cell.value?.toString().trim().toLowerCase() === objectName.toLowerCase()) {
          position = { row, col };
          break;
        }
      }
      if (position) break;
    }
    
    return position;
  }

  private populateColumnData(worksheet: ExcelJS.Worksheet, column: number, startRow: number, values: any[]) {
    values.forEach((entry: any, index) => {
      // console.log(entry)
      const rowIndex = startRow + index;
      worksheet.getCell(rowIndex, column).value = entry.value;
    });
  }

  private async openFileInSpreadsheet(file: File) {
    console.log('🔧 Loading Excel data into Syncfusion spreadsheet...');
    try {
      // Check if spreadsheet is properly initialized
      if (!this.spreadsheetObj) {
        console.error('❌ Spreadsheet object not initialized');
        this.isLoading = false;
        return;
      }
      
      // Read the Excel file using ExcelJS and convert to Syncfusion format
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.worksheets[0];
      const sheetData: any[][] = [];
      const formattingData: any[][] = [];
      
      // Convert ExcelJS data to 2D array for Syncfusion with formatting
      worksheet.eachRow((row, rowNumber) => {
        const rowData: any[] = [];
        const formatData: any[] = [];
        
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          let cellValue = cell.value;
          
          // Check if the cell value is a Date object and format it as time only
          if (cellValue instanceof Date) {
            // Format as HH:MM
            const hours = cellValue.getHours().toString().padStart(2, '0');
            const minutes = cellValue.getMinutes().toString().padStart(2, '0');
            cellValue = `${hours}:${minutes}`;
          }
          
          rowData[colNumber - 1] = cellValue;
          
          // Preserve basic formatting information (simplified to avoid Syncfusion errors)
          const cellStyle: any = {};
          
          if (cell.font?.bold) cellStyle.fontWeight = 'bold';
          if (cell.font?.italic) cellStyle.fontStyle = 'italic';
          if (cell.alignment?.horizontal) cellStyle.textAlign = cell.alignment.horizontal;
          if (cell.font?.size) cellStyle.fontSize = `${cell.font.size}px`;
          
          formatData[colNumber - 1] = {
            style: cellStyle
          };
        });
        
        sheetData[rowNumber - 1] = rowData;
        formattingData[rowNumber - 1] = formatData;
      });
      
      console.log('📊 Converted Excel data with formatting, rows:', sheetData.length);
      
      // Load data directly into spreadsheet without complex formatting to avoid errors
      this.spreadsheetObj.sheets = [{
        name: 'Sheet1',
        rows: sheetData.map((rowData, index) => ({
          index: index,
          cells: rowData.map((cellValue, cellIndex) => ({
            index: cellIndex,
            value: cellValue
          }))
        }))
      }];
      
      // Refresh the spreadsheet to display the data
      this.spreadsheetObj.dataBind();
      console.log('✅ Spreadsheet loaded with Excel data');
      this.isLoading = false;
      
    } catch (error) {
      console.error('❌ Error loading Excel data:', error);
      this.isLoading = false;
    }
  }

  private async loadExistingData(baseFile: File): Promise<any> {
    console.log("🔄 Loading existing data...");
    console.log("📁 Base file received:", baseFile.name, "Size:", baseFile.size);
    let fileR: File;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const response = await this.apiService.getDataEntries(
        this.selectedSection!.type,
        today
      );
      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(baseFile);

      // if there is a response
      if (response.length > 0) {
        console.log("Response: ", response);
        this.dataStatus = response[0].status;
        this.currentEntryId = response[0]._id;
        const data = response[0].data;

        // open the base file for that section
        reader.onload = () => {
          const buffer = reader.result as any;
          
          workbook.xlsx
            .load(buffer)
            .then(async () => {
              const worksheet = workbook.worksheets[0];
              
              // Update time slots for all sections (always update based on current time)
              const timeSlots = this.getTimeSlots();
              console.log('⏰ Generated time slots for existing data:', timeSlots, 'Section:', this.selectedSection!.type);
              
              // Find the time column in the worksheet
              let timeColumnIndex = 1; // Default to column A (1-based)
              
              // Search for time-related headers to find the correct column
              for (let col = 1; col <= 10; col++) {
                const headerCell = worksheet.getCell(1, col);
                const headerValue = headerCell.value?.toString().toLowerCase();
                if (headerValue && (headerValue.includes('time') || headerValue.includes('hour') || col === 1)) {
                  timeColumnIndex = col;
                  break;
                }
              }
              
              timeSlots.forEach((time, index) => {
                // SAG mill starts from row 3, others start from row 2
                const startRow = this.selectedSection!.type === 'sag' ? 3 : 2;
                const cellAddress = this.alphabets[timeColumnIndex - 1] + (index + startRow).toString();
                worksheet.getCell(cellAddress).value = time;
                console.log(`⏰ Setting time ${time} at ${cellAddress} for ${this.selectedSection!.type} (start row: ${startRow})`);
              });
              
              Object.keys(data).forEach((objectName) => {
                const position = this.findObjectNamePosition(worksheet, objectName);
                // console.log("Object name:", objectName, "position:", position);

                if (position && data[objectName].values) {
                  const values = data[objectName].values;
                  // Start populating data in the row below the object name
                  this.populateColumnData(worksheet, position.col, position.row + 1, values);
                }
              });
              workbook.xlsx.writeBuffer().then((buffer: any) => {
                console.log('📝 Excel buffer created (with existing data), size:', buffer.byteLength);
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let file1: File = new File([blob], 'Worksheet1.xlsx');
                console.log('📄 Final file created:', file1.name, 'Size:', file1.size);
                this.openFileInSpreadsheet(file1);
              });

            })
            .catch((error) => {
              console.log(error)
            });
          }
      }
      else {
        this.dataStatus = 'pending';
        reader.onload = () => {
        const buffer = reader.result as any;
        workbook.xlsx
            .load(buffer)
            .then(async () => {
              const worksheet = workbook.worksheets[0];
              
              // Update time slots for all sections (always update based on current time)
              const timeSlots = this.getTimeSlots();
              console.log('⏰ Generated time slots for new data:', timeSlots, 'Section:', this.selectedSection!.type);
              
              // Find the time column in the worksheet
              let timeColumnIndex = 1; // Default to column A (1-based)
              
              // Search for time-related headers to find the correct column
              for (let col = 1; col <= 10; col++) {
                const headerCell = worksheet.getCell(1, col);
                const headerValue = headerCell.value?.toString().toLowerCase();
                if (headerValue && (headerValue.includes('time') || headerValue.includes('hour') || col === 1)) {
                  timeColumnIndex = col;
                  break;
                }
              }
              
              timeSlots.forEach((time, index) => {
                // SAG mill starts from row 3, others start from row 2
                const startRow = this.selectedSection!.type === 'sag' ? 3 : 2;
                const cellAddress = this.alphabets[timeColumnIndex - 1] + (index + startRow).toString();
                worksheet.getCell(cellAddress).value = time;
                console.log(`⏰ Setting time ${time} at ${cellAddress} for ${this.selectedSection!.type} (start row: ${startRow})`);
              });
              
              workbook.xlsx.writeBuffer().then((buffer: any) => {
                console.log('📝 Excel buffer created (new data), size:', buffer.byteLength);
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                let file1: File = new File([blob], 'Worksheet1.xlsx');
                console.log('📄 Final file created:', file1.name, 'Size:', file1.size);
                this.openFileInSpreadsheet(file1);
              });

            })
            .catch((error) => {
              console.log(error)
            });
        // // this.spreadsheetObj!.open({ file: baseFile });
        // if(this.selectedSection!.type === "cil" ) this.updateTimeSlots(baseFile);
      }
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
      const data: { [key: string]: { values: { time: string; value: string | number }[] } } = {};
      
      const CILobjectNames = [
        'SOLN Au (ppm)', 
        '% SOLIDS', 
        'pH', 
        'CN CONC (ppm)', 
        'DO (mg/L)', 
        'CAR CONC (g/L)'
      ];

      const crushingObjectNames = [
        "WEIGHTOMETER READING",
        "TONNES CRUSHED",
        "COMMENTS",
      ];
      let objectNames: string[] = [];

      if(this.selectedSection!.type === "cil")
        objectNames = CILobjectNames;
      else if(this.selectedSection!.type === "crushing")
        objectNames = crushingObjectNames;
      
      // Collect data from spreadsheet
      objectNames.forEach((objectName, colIndex) => {

        data[objectName] = { values: [] };
        // CIL takes data in a two hour interval. Let them know that they only need to enter for those
        // two hour intervals. The rest should go in as zero. Later write logic to delete these values since it can 
        // affect forecasting
        // consider using get time slots function
          this.getTimeSlots().forEach((time, rowIndex) => {
          const sheet = this.spreadsheetObj.getActiveSheet();
          let cell: CellModel = getCell(1 + rowIndex, 1 + colIndex, sheet);
          // To get the formatted cell value, specify the cell model.
          // console.log(this.spreadsheetObj.getDisplayText(cell));
          const cellValue = this.spreadsheetObj.getDisplayText(cell)
          
          if (cellValue !== null && cellValue !== undefined) {
            data[objectName].values.push({
              time,
              value: objectName === "COMMENTS" ? cellValue : Number(cellValue)
            });
          }
        });
      });
      // Submit to API
      // console.log(data);
      await this.apiService.submitDataEntry(this.employeeId!, this.selectedSection!.type, data);
      this.showMessage('Data submitted successfully');
      this.dataStatus = 'pending';
    } catch (error) {
      console.error('Error submitting data:', error);
      this.showMessage('Error submitting data');
    } finally {
      this.isLoading = false;
    }
  }

  onSectionChange(event: any) {
    this.selectedSection = event.value;
    this.loadSectionData();
  }

  async loadSectionData() {
    this.isLoading = true;
    try {
      console.log('🔄 Loading section data for:', this.selectedSection?.name);
      // Get file data using the section's id
      const baseFile = await lastValueFrom(this.dataService.getFileData$(+this.selectedSection!.id));
      let file: File = new File([baseFile], 'Worksheet.xlsx');
      await this.loadExistingData(file);
    } catch (error) {
      console.error('Error loading section data:', error);
      this.snackBar.open('Error loading section data', 'Close', { duration: 3000 });
      this.isLoading = false;
    }
  }

  private populateSpreadsheet(data: any) {
    // Implement logic to populate spreadsheet with existing data
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
