import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/features/userManagement/Entities/users.model';
import { InvoiceService } from '../../../Services/invoice.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';



@Component({
  selector: 'app-create-invoice',
  templateUrl: './invoice-create.component.html',
})
export class InvoiceCreateComponent implements OnInit {
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

  constructor(
    private invoiceService: InvoiceService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    console.log('Token:', this.token);
  }

  async loadUsers() {
    
    try {
      const res = await this.userService.getAllUsers(this.token);
      this.users = res.usersList;
      //console.log('Users:', this.users);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }

  async createInvoice() {
    const payload = {
      ...this.formdata,
      user: {
        id: Number(this.formdata.userId)
      }
    };
    delete payload.userId;
  
    try {
      console.log('Payload:', payload);
      await this.invoiceService.createInvoice1(payload, this.token);
      this.alertMessage = 'Invoice created successfully!';
      this.alertType = 'alert-success';
      setTimeout(() => this.router.navigate(['/admin/invoice']), 1500);
    } catch (err) {
      console.error('Error creating invoice:', err);
      this.alertMessage = 'Failed to create invoice.';
      this.alertType = 'alert-danger';
    }
  }
  
}
