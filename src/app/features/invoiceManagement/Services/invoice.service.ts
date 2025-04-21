import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Invoice } from '../Entities/invoice.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private BASE_URL = `http://localhost:8089/gaspillagezero/invoices`;
  private getAuthHeaders(token: string) {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  constructor(private http: HttpClient) {}

  createInvoice(invoice: Invoice) {
    const token = localStorage.getItem('token')||sessionStorage.getItem('token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

    return this.http.post(this.BASE_URL, invoice, { headers });
  }

  async createInvoice1(invoiceData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}`;
    const headers = this.getAuthHeaders(token);
    try {
      const response = await this.http.post<any>(url, invoiceData, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllInvoices(token: string): Promise<any> {
    const url = `${this.BASE_URL}`;
    const headers = this.getAuthHeaders(token);
    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getInvoiceById(id: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/${id}`;
    const headers = this.getAuthHeaders(token);
    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      console.log('return Invoice:', response);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateInvoice(id: string, invoiceData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/${id}`;
    const headers = this.getAuthHeaders(token);
    try {
      const response = await this.http.put<any>(url, invoiceData, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteInvoice(id: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/${id}`;
    const headers = this.getAuthHeaders(token);
    try {
      const response = await this.http.delete<any>(url, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  getInvoicePdf(invoiceId: string): Observable<Blob> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/pdf'
    });
  
    const url = `${this.BASE_URL}/${invoiceId}/pdf`;
    return this.http.get(url, { headers, responseType: 'blob' });
  }
  
}
