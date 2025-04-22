import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from 'src/app/features/userManagement/Entities/users.model';
import { InvoiceService } from '../../../Services/invoice.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';


@Component({
  selector: 'app-edit-invoice',
  templateUrl: './invoice-update.component.html',
})
export class InvoiceUpdateComponent implements OnInit {
  formdata: any = {
    userId: '',
    date: '',
    dueDate: '',
    status: '',
    total: 0
  };

  users: Users[] = [];
  alertMessage: string = '';
  alertType: string = '';
  token: string = localStorage.getItem('token') || '';
  invoiceId!: number;

  constructor(
    private invoiceService: InvoiceService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Invoice ID from route:', this.invoiceId);
    this.loadUsers();
    this.loadInvoice();
  }

  async loadUsers() {
    try {
      const res = await this.userService.getAllUsers(this.token);
      this.users = res.usersList;
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }

  async loadInvoice() {
    try {
      const res = await this.invoiceService.getInvoiceById(String(this.invoiceId), this.token);
      const invoice = res;
      console.log('Invoice:', invoice);
      this.formdata = {
        userId: invoice.user.id,
        date: new Date(invoice.date).toISOString().substring(0, 10),
        dueDate: new Date(invoice.dueDate).toISOString().substring(0, 10),
        status: invoice.status,
        total: invoice.total
      };
      
    } catch (err) {
      console.error('Error loading invoice:', err);
    }
  }

  async updateInvoice() {
    const payload = {
      ...this.formdata,
      date: new Date(this.formdata.date).getTime(),
      dueDate: new Date(this.formdata.dueDate).getTime(),
      user: {
        id: Number(this.formdata.userId)
      }
    };
    //delete payload.userId;
    console.log('Payload:', payload);
    try {
      
      await this.invoiceService.updateInvoice(String(this.invoiceId), payload, this.token);
      console.log('Invoice updated successfully!');
      this.router.navigate(['/admin/invoice']);
    } catch (err) {
      console.error('Error updating invoice:', err);
      this.alertMessage = 'Failed to update invoice.';
      this.alertType = 'alert-danger';
    }
  }
}
