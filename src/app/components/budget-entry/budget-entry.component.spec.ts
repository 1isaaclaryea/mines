import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetEntryComponent } from './budget-entry.component';

describe('BudgetEntryComponent', () => {
  let component: BudgetEntryComponent;
  let fixture: ComponentFixture<BudgetEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
