import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { BudgetEntry } from '../../interfaces/budgetEntry';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-budget-entry',
  templateUrl: './budget-entry.component.html',
  styleUrls: ['./budget-entry.component.css'],
  standalone: false
})
export class BudgetEntryComponent implements OnInit {
  budgetForm!: FormGroup;
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  months = Array.from({ length: 12 }, (_, i) => i + 1);
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadBudgetData();
  }

  private initializeForm(): void {
    this.budgetForm = this.fb.group({
      crushing: this.fb.group({
        dryTonnes: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        crusherAvailability: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        crusherUtilization: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        stockpileClosingBalance: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]]
      }),
      milling: this.fb.group({
        dryTonnes: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        millAvailability: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        millUtilization: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        grindSize: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        recirculatingLoad: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        cycUfFeedToFlash: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      grade: this.fb.group({
        millFeedGoldGrade: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        cycloneUfGoldGrade: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        millFeedTotalSulphurGrade: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        millFeedPyriticSulphur: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        millFeedArsenic: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        flashFeedSulphurGrade: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        flashConcSulphurGrade: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      recovery: this.fb.group({
        gravityRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        flashFlotationMassPull: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        conventionalFlotationMassPull: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        overallFlotationMassPull: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        flashFlotationGoldRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        convFlotationGoldRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        overallFlotationGoldRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        flashFlotationSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        convFlotationSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        overallFlotationSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        flashFlotationPyriticSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        convFlotationPyriticSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        overallFlotationPyriticSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      cilGoldRecovered: this.fb.group({
        overallPlantRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        totalSulphurRecovery: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      goldPoured: this.fb.group({
        goldPouredOunces: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        openingGoldInventory: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        closingGoldInventory: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]]
      }),
      biox: this.fb.group({
        sulphurOxidation: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        grindSize: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      reagentsConsumption: this.fb.group({
        sodiumCyanide: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        quicklime: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        grindingMedia: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        activatedCarbon: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        sodiumHydroxide: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        hcl: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        flocullant: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        xanthate: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        promoter: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        copperSulphate: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        frother: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        fuel: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        cement: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]]
      }),
      waterTreatment: this.fb.group({
        processWaterTreatmentVolume: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        ro250Plant: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        ro500Plant: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        ro140Plant: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]],
        stpWtp: [null, [Validators.required, Validators.min(0), Validators.max(1000000)]]
      })
    });
  }

  loadBudgetData(): void {
    this.loading = true;
    this.budgetService.getBudgetEntry(this.currentYear, this.currentMonth)
      .subscribe({
        next: (data: BudgetEntry) => {
          console.log(data);
          this.budgetForm.patchValue(data.data);
          this.loading = false;
        },
        error: (error) => {
          if (error.status !== 404) {
            this.snackBar.open('Error loading budget data', 'Close', { duration: 3000 });
          }
          this.loading = false;
        }
      });
  }

  onMonthChange(month: number): void {
    this.currentMonth = month;
    this.loadBudgetData();
  }

  onYearChange(year: number): void {
    this.currentYear = year;
    this.loadBudgetData();
  }

  saveDraft(): void {
    if (this.budgetForm.invalid) {
      this.markFormGroupTouched(this.budgetForm);
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.saving = true;
    const data = {
      data: this.budgetForm.value,
      status: 'draft' as const
    };

    this.saveOrUpdate(data);
  }

  submit(): void {
    if (this.budgetForm.invalid) {
      this.markFormGroupTouched(this.budgetForm);
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.saving = true;
    const data = {
      data: this.budgetForm.value,
      status: 'submitted' as const
    };

    this.saveOrUpdate(data);
  }

  private saveOrUpdate(data: Partial<BudgetEntry>): void {
    this.budgetService.getBudgetEntry(this.currentYear, this.currentMonth)
      .subscribe({
        next: (existingEntry) => {
          // Update existing entry
          this.budgetService.updateBudgetEntry(this.currentYear, this.currentMonth, data)
            .subscribe(this.handleSaveSuccess.bind(this), this.handleSaveError.bind(this));
        },
        error: (error) => {
          if (error.status === 404) {
            // Create new entry
            this.budgetService.createBudgetEntry(this.currentYear, this.currentMonth, data.data!)
              .subscribe(this.handleSaveSuccess.bind(this), this.handleSaveError.bind(this));
          } else {
            this.handleSaveError(error);
          }
        }
      });
  }

  private handleSaveSuccess(response: BudgetEntry): void {
    this.saving = false;
    this.snackBar.open('Budget data saved successfully', 'Close', { duration: 3000 });
  }

  private handleSaveError(error: any): void {
    this.saving = false;
    this.snackBar.open('Error saving budget data', 'Close', { duration: 3000 });
    console.error('Error saving budget data:', error);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
