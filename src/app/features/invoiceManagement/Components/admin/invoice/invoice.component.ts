import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../../Entities/invoice.model';
import { InvoiceService } from '../../../Services/invoice.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  searchTerm: string = '';
  alerts: { type: string, message: string }[] = [];

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.getInvoices();
  }

  showItems: boolean[] = [];

async getInvoices(): Promise<void> {
  const token = localStorage.getItem('token') || '';
  try {
    const data = await this.invoiceService.getAllInvoices(token);
    this.invoices = data;
    this.filteredInvoices = [...this.invoices];
    this.showItems = new Array(this.filteredInvoices.length).fill(false); // initialize

  } catch (error) {
    this.alerts.push({
      type: 'alert-danger',
      message: '❌ Failed to fetch invoices!'
    });
    console.error('Error fetching invoices:', error);
  }
}




  downloadPdf(invoiceId: any): void {
    this.invoiceService.getInvoicePdf(String(invoiceId)).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${invoiceId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.alerts.push({
          type: 'alert-danger',
          message: `❌ Failed to download PDF for invoice ${invoiceId}`
        });
        console.error('Error downloading invoice PDF:', error);
      }
    );
  }

  async deleteInvoice(invoiceId: any): Promise<void> {
    const token = localStorage.getItem('token') || '';
    try {
      await this.invoiceService.deleteInvoice(String(invoiceId), token);
      this.alerts.push({
        type: 'alert-success',
        message: `✅ Invoice ${invoiceId} deleted successfully!`
      });
      this.getInvoices();
    } catch (error) {
      this.alerts.push({
        type: 'alert-danger',
        message: `❌ Failed to delete invoice with ID: ${invoiceId}`
      });
      console.error('Error deleting invoice:', error);
    }
  }

  searchInvoices(): void {
     const term = this.searchTerm.toLowerCase();
     this.filteredInvoices = this.invoices.filter(invoice =>
       invoice.user?.name?.toLowerCase().includes(term)
     );
  }

  openInvoiceModal(): void {
    console.log('Opening invoice modal...');
  }

  editInvoice(invoice: Invoice): void {
    console.log('Editing invoice:', invoice);
  }

  toggleItems(index: number): void {
    this.showItems[index] = !this.showItems[index];
  }
  
}
