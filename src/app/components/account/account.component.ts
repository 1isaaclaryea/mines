import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: false
})

export class AccountComponent implements OnInit {
  users: User[] = [];
  newUser: User = {
    name: '',
    employeeId: '',
    role: 'operator',
    section: '',
    email: '',
    password: '',
    phoneNumber: '',
    isActive: true,
    isAdmin: false
  };

  // Remember to get a global definition for section. Most likely using an interface
  sections = [
    { name: 'CIL Plant' , value: 'cil'},
    { name: 'Crushing Shift' , value: 'crushing'},
    { name: 'SAG Mill' , value: 'sag'}
  ];


  roles = [
    { value: 'operator', label: 'Operator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Administrator' }
  ];

  isLoading = false;
  isAdmin = false;
  displayedColumns = ['name', 'role', 'section', 'email', 'phoneNumber', 'status', 'lastLogin', 'actions'];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const userRole = localStorage.getItem('userIsAdmin');
    if (userRole !== 'true') {
      this.showMessage('Access denied. Admin privileges required.');
      this.router.navigate(['/']);
      return;

    }
    this.isAdmin = true;
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.isLoading = true;
      this.users = await this.apiService.getUsers();

    } catch (error) {
      this.showMessage('Error loading users');
      console.error('Error loading users:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async createUser(): Promise<void> {
    try {
      this.isLoading = true;
      if(this.newUser.role === 'admin'){
        this.newUser.isAdmin = true;
      }
      await this.apiService.createUser(this.newUser);
      this.showMessage('User created successfully');
      this.resetForm();
      await this.loadUsers();
    } catch (error) {
      this.showMessage('Error creating user');
      console.error('Error creating user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      this.isLoading = true;
      if (!user._id) throw new Error('User ID is required');
      await this.apiService.updateUser(user._id, user);
      this.showMessage('User updated successfully');
      await this.loadUsers();
    } catch (error) {
      this.showMessage('Error updating user');
      console.error('Error updating user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      this.isLoading = true;
      await this.apiService.updateUserStatus(userId, isActive);
      this.showMessage(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      await this.loadUsers();
    } catch (error) {
      this.showMessage('Error updating user status');
      console.error('Error updating user status:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      this.isLoading = true;
      await this.apiService.deleteUser(userId);
      this.showMessage('User deleted successfully');
      await this.loadUsers();
    } catch (error) {
      this.showMessage('Error deleting user');
      console.error('Error deleting user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.newUser = {
      name: '',
      employeeId: '',
      role: 'operator',
      section: '',
      email: '',
      password: '',
      phoneNumber: '',
      isActive: true,
      isAdmin: false
    };
  }


  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
