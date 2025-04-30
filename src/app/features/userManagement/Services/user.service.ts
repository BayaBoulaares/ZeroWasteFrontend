import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = "http://localhost:8089/gaspillagezero";

  constructor(private http: HttpClient) { }

  async moderateImage(file: File): Promise<any> {
    const url = "http://localhost:8000/moderate-image";
    const formData: FormData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await this.http.post<any>(url, formData).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async loginWithGoogle(idToken: string): Promise<any> {
    return this.http.post<any>(`${this.BASE_URL}/auth/google-login`, { idToken }).toPromise();
  }

  async login(email: string, password: string): Promise<any> {
    const url = `${this.BASE_URL}/auth/login`;
    try {
      const response = await this.http.post<any>(url, { email, password }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: any): Promise<any> {
    const url = `${this.BASE_URL}/auth/register`;
    try {
      const response = await this.http.post<any>(url, userData).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-all-users`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.get<any>(url, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getYourProfile(token: string): Promise<any> {
    const url = `${this.BASE_URL}/adminuser/get-profile`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.get<any>(url, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getUsersById(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-user/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.get<any>(url, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/delete/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.delete<any>(url, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/update/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.put<any>(url, userData, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/create`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.post<any>(url, userData, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  /*** AUTHENTICATION METHODS ***/
  logOut(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role = sessionStorage.getItem('role') || localStorage.getItem('role');
    return role === 'ADMIN';
  }

  isUser(): boolean {
    const role = sessionStorage.getItem('role') || localStorage.getItem('role');
    return role === 'USER';
  }

  getUser() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  async sendResetEmail(email: string): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken() || ''}`
    };
    const body = { email };
    const res = await fetch(`${this.BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return res.json();
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const response = await fetch(`${this.BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        newPassword
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Reset password failed');
    }

    return await response.json().catch(() => ({ message: 'Password reset successful' }));
  }
}
