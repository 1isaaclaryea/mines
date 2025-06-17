import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {
  themes = ['light', 'dark', 'high-contrast'];
  fonts = ['Arial', 'Roboto', 'Open Sans', 'Helvetica'];
  fontSizes = [12, 14, 16, 18, 20];

  preferences = {
    theme: 'light',
    font: 'Arial',
    fontSize: 14,
    enableAutoSave: true,
    gridLines: true
  };

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPreferences();
  }

  loadPreferences() {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      this.preferences = { ...this.preferences, ...JSON.parse(savedPrefs) };
    }
  }

  savePreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }
}
