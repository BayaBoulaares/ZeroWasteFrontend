import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/order.service';
import { SupplierService } from '../../../Services/supplier.service';
import { Supplier } from '../../../Entities/supplier.model'; // Adjust the import path as necessary
import { Order } from '../../../Entities/order.model'; // Adjust the import path as necessary
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-orders',
  templateUrl: './supplier-orders.component.html',
})
export class SupplierOrdersComponent implements OnInit {
  supplierId = 1;
  orders: Order[] = [];
  message = ''; // Message input by the user
  response = ''; // Response from the bot
  userId = 1; 
  chatVisible = false;

  urgentOrders: Order[] = [];
  // Placeholder for user ID
  constructor(private orderService: OrderService, private supplier: SupplierService, private http: HttpClient) {}

  ngOnInit(): void {
    this.orderService.getOrdersBySupplier(this.supplierId).subscribe(data => {
      this.orders =  data.map(order => {
        // Check if deliveryDate is an array (e.g., [2025, 5, 3, 0, 0])
        if (Array.isArray(order.deliveryDate)) {
          // Create a Date object from the array (Year, Month, Day, Hours, Minutes, Seconds)
          const test = order.deliveryDate[0] + '-' + (order.deliveryDate[1]) + '-' + order.deliveryDate[2];
          console.log('test', order.deliveryDate[0]);
          console.log('test', order.deliveryDate[1]);
          console.log('test', order.deliveryDate[2]);
          order.deliveryDate = test;
        } else {
          // If it's already a Date object or string, just parse it
          order.deliveryDate = (order.deliveryDate);
        }
        return order;
      });
      this.orders = this.orders.filter(o => o.quantity > 0 && o.deliveryDate && o.supplier && o.ingredient);
      this.checkUpcomingDeliveries();

    });
    setInterval(() => {
      this.checkUpcomingDeliveries();
    }, 10 * 60 * 1000);
    
  }
  toggleOrderStatus(order: Order): void {
    if (!order.orderID) return; // Avoid error if orderID is undefined
  
    let newStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED';
  
    switch (order.orderStatus) {
      case 'PENDING':
        newStatus = 'COMPLETED';
        break;
      case 'COMPLETED':
        newStatus = 'PENDING';
        break;
      case 'CANCELED':
        newStatus = 'CONFIRMED';
        break;
      case 'CONFIRMED':
        newStatus = 'CANCELED';
        break;
      default:
        return; // If no valid status, do nothing
    }
  
    const parts = order.deliveryDate.split('-'); // ["2025", "06", "03"]

    const dateArray = [
      parseInt(parts[0], 10),      // year
      parseInt(parts[1], 10),      // month
      parseInt(parts[2], 10),      // day
      0,                           // hour
      0                            // minute
    ];

    const updatedOrder = { ...order, deliveryDate : dateArray , orderStatus: newStatus };
    console.log('id:', order.orderID);
  
    this.orderService.updateOrderStatus(order.orderID, updatedOrder).subscribe({
      next: () => {
        order.orderStatus = newStatus;  // Update the status in the UI
      },
      error: (err: any) => {
        console.error('Error updating status:', err);
      }
    });
  }
  getButtonText(orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED'): string {
    switch (orderStatus) {
      case 'PENDING':
        return 'Mark Completed';  // If status is 'PENDING', show "Mark Completed"
      case 'COMPLETED':
        return 'Mark Pending';  // If status is 'COMPLETED', show "Mark Pending"
      case 'CANCELED':
        return 'Reinstate';  // If status is 'CANCELED', show "Reinstate"
      case 'CONFIRMED':
        return 'Cancel Order';  // If status is 'CONFIRMED', show "Cancel Order"
      default:
        return 'Unknown Status';  // Fallback in case there's an unexpected status
    }
  }
  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }
  // Dans order-list.component.ts
  checkUpcomingDeliveries(): void {
    this.urgentOrders = this.orders.filter(order => 
      this.checkIfUrgent(order.deliveryDate) && order.orderStatus === 'PENDING'
    );

    this.urgentOrders.forEach(order => {
      
      this.updateOrderStatus(order, 'CONFIRMED');
    });
  }
  private checkIfUrgent(deliveryDate: string): boolean {
    const delivery = new Date(deliveryDate);
    const now = new Date();
    const inTwoDays = new Date(now);
    inTwoDays.setDate(now.getDate() + 2);
    return delivery >= now && delivery <= inTwoDays;
  }


  updateOrderStatus(order: Order, newStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED'): void {
    const updatedOrder = { 
      ...order, 
      orderStatus: newStatus,
      isUrgent: this.checkIfUrgent(order.deliveryDate)
    };

    this.orderService.updateOrderStatus(order.orderID, updatedOrder).subscribe({
      next: () => {
        order.orderStatus = newStatus;
        order.isUrgent = updatedOrder.isUrgent;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        Swal.fire('Error', 'Failed to update order status', 'error');
      }
    });
  }

    getStatusClass(status: string): string {
      return status.toLowerCase();
    }
}