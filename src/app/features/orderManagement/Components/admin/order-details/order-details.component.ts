import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../Services/order.service';
import { DownloadPdfService } from '../../../Services/download-pdf.service';
import { NotificationService } from '../../../Services/notification.service';
import { Order } from '../../../Entities/order.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
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
    if (!this.order) return;
  
    // Traitement cohérent avec OrderListComponent
    if (order.deliveryDate) {
      if (Array.isArray(order.deliveryDate)) {
        // Format [year, month, day, ...]
        const [year, month, day] = order.deliveryDate;
        this.order.deliveryDate = new Date(year, month - 1, day);
      } else if (typeof order.deliveryDate === 'string') {
        // Si c'est une string au format YYYY-MM-DD
        const parts = order.deliveryDate.split('-');
        if (parts.length === 3) {
          this.order.deliveryDate = new Date(
            parseInt(parts[0]), 
            parseInt(parts[1]) - 1, 
            parseInt(parts[2])
          );
        } else {
          // Autre format de string
          this.order.deliveryDate = new Date(order.deliveryDate);
        }
      } else {
        // Si c'est déjà un objet Date
        this.order.deliveryDate = new Date(order.deliveryDate);
      }
  
      // Validation de la date
      if (isNaN(this.order.deliveryDate.getTime())) {
        console.warn('Date de livraison invalide, utilisation de la date actuelle');
        this.order.deliveryDate = new Date();
      }
    } else {
      this.order.deliveryDate = new Date(); // Fallback
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
