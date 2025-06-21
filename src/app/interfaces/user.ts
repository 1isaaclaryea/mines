export interface User {
  _id?: string;
  name: string;
  employeeId: string;
  role: 'operator' | 'supervisor' | 'manager' | 'admin';
  section?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  isActive: boolean;
  isAdmin: boolean;
  dateRegistered?: Date;
  lastLogin?: Date;
} 