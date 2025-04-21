import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/order.service';
import { Order } from '../../../Entities/order.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  count : any;
  isLoading = false;
  filteredOrders: Order[] = []; // Filtered list of orders
  orderStatus: string[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
  searchQuery: string = '';
  constructor(private orderService: OrderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.getCountOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data.map(order => {
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
      this.orders = this.orders.filter(o => o.quantity > 0 && o.deliveryDate && o.supplier && o.ingredient)
      console.log('orders', this.orders);
      console.table(this.orders.map(o => ({
        id: o.orderID,
        status: o.orderStatus
      })));
    });
  }
  // filterOrdersBySupplierName(): void {
  //   if (this.searchQuery.trim()) {
  //     this.filteredOrders = this.orders.filter(order => 
  //       order.supplier?.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  //     );
  //   } else {
  //     // If searchQuery is empty, show all orders
  //     this.filteredOrders = [...this.orders];
  //   }
  // }
  reloadOrders(): void {
    this.loadOrders(); // Re-fetch the orders to show the updated status
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

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.orders = this.orders.filter(o => o.orderID !== id);
      });
    }
  }
  getStatusClass(status: string): string {
    return status.toLowerCase();
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
    console.log('updatedOrder:', updatedOrder);


    this.orderService.updateOrderStatus(order.orderID, updatedOrder).subscribe({
      next: () => {
        order.orderStatus = newStatus;
        alert(`Order status changed to ${newStatus}`);
      },
      error: (err: any) => {
        console.error('Error updating status:', err);
      }
    });
  }
  viewOrderDetails(order: Order): void {
    this.router.navigate(['/orders', order.orderID]);
  }
  getCountOrders(): void {
    this.orderService.getCountOrders().subscribe({
      next: (res) => {
        console.log(res);
        this.count = res;  // Update the status in the UI
      },
      error: (err: any) => {
        console.error('Error getting count', err);
      }
    });
  }
}
