import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../Services/order.service';
import { DownloadPdfService } from '../../../Services/download-pdf.service';
import { NotificationService } from '../../../Services/notification.service';
import { Order } from '../../../Entities/order.model';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = false;
 
   statuses: string[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];

  showNotifications = false;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private downloadPdfService: DownloadPdfService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const orderID = Number(this.route.snapshot.paramMap.get('id'));
    if (orderID) this.loadOrderDetails(orderID);
  }
 
  loadOrderDetails(orderID: number): void {
    this.isLoading = true;
    this.orderService.getOrderById(orderID).subscribe({
      next: (order) => {
        this.order = order;
        this.processOrderData(order);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement commande:', err);
        this.isLoading = false;
        alert('❌ Une erreur est survenue lors du chargement de la commande.');
      }
    });
  }
  
  private processOrderData(order: Order): void {
  
    
  
    if (this.order) {
      this.order.deliveryDate = new Date(order.deliveryDate);
    }
    
  }

  private isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  removeNotification(notification: any): void {
    this.notificationService.removeNotification(notification);
  }
 

  printOrder(): void {
    window.print();
  }

  

  
 

  exportAsPDF(): void {
    const element = document.getElementById('orderDetails') as HTMLElement;
    if (element) {
      this.downloadPdfService.downloadPdf(element, 'order-details.pdf');
    } else {
      console.error('Élément avec id "orderDetails" introuvable.');
      alert('Erreur : Élément "orderDetails" introuvable.');
    }
  }

 
  private generateNewOrderID(): number {
    return Math.floor(Math.random() * 1000000); // Simple ID generation logic
  }

  cancelOrder() {
    const confirmation = confirm('❗ Voulez-vous vraiment annuler la commande ?');
    if (confirmation) {
      console.log('Commande annulée');
      alert('🗑️ Commande annulée.');
    }
  }
 
}
