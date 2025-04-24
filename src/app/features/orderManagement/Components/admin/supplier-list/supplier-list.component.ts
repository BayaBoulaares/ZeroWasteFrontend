import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../Services/supplier.service';
import { Supplier } from '../../../Entities/supplier.model';
import { Order } from '../../../Entities/order.model'; // Adjust the import path as necessary
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import * as emailjs from 'emailjs-com';
import { trigger, transition, style, animate } from '@angular/animations';
import { OrderService } from '../../../Services/order.service';
   // Adjust the import path as necessary
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  count : any;
  isLoadingEmail: boolean = false;
  showOnlyFavorites: boolean = false; 
  constructor(private supplierService: SupplierService, private http: HttpClient, private orderService: OrderService) {}

  ngOnInit(): void {
    this.getAllSuppliers();
    this.getCountSuppliers();
  }
  
  getAllSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }
  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => { 
      });
      this.getAllSuppliers();
    }
  }
  toggleFavorite(supplierId: number): void {
    this.supplierService.toggleFavorite(supplierId).subscribe(() => {
      // Update the supplier's 'isFavorite' status after toggling
      const supplier = this.suppliers.find(s => s.supplierID === supplierId);
      if (supplier) {
        supplier.isFavorite = !supplier.isFavorite; // Toggle the favorite status
      }
    });
  }

  toggleShowFavorites(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;  // Toggle the showOnlyFavorites property
    if (this.showOnlyFavorites) {
      // Fetch only favorite suppliers
      this.supplierService.getFavoriteSuppliers().subscribe(
        (favorites) => this.suppliers = favorites
      );
    } else {
      // Fetch all suppliers
      this.supplierService.getAllSuppliers().subscribe(
        (allSuppliers) => this.suppliers = allSuppliers
      );
    }
  }
  
  getCountSuppliers(): void {
    this.supplierService.getCountSuppliers().subscribe({
      next: (res) => {
        console.log(res);
        this.count = res;  // Update the status in the UI
      },
      error: (err: any) => {
        console.error('Error getting count', err);
      }
    });
  }
  private getOrdersForSupplier(supplierId: number): Promise<Order[]> {
    return this.orderService.getOrdersBySupplier(supplierId)
      .toPromise()
      .then((orders: Order[] | undefined) => orders ?? []);
  }
  
  async sendEmailToSupplier(supplier: Supplier): Promise<void> {
    // Vérification initiale de l'email
    if (!this.isValidEmail(supplier.contactInfo)) {
      Swal.fire('Error', 'Invalid email address', 'error');
      return;
    }
  
    this.isLoadingEmail = true;
  
    try {
      const allOrders = await this.getOrdersForSupplier(supplier.supplierID!);
  
      // Log des commandes pour débogage
      console.log('All Orders:', allOrders);
  
      // Filtrage des commandes pertinentes
      const relevantStatuses = ['PENDING', 'COMPLETED', 'CANCELED', 'CONFIRMED'];
      const orders = allOrders.filter(order => {
        // Vérification si la date de livraison est un tableau
        if (Array.isArray(order.deliveryDate)) {
          order.deliveryDate = `${order.deliveryDate[0]}-${order.deliveryDate[1]}-${order.deliveryDate[2]}`;
        }
        
        // Convertir la date de livraison en objet Date
        const deliveryDate = new Date(order.deliveryDate);
        console.log(`Checking order #${order.orderID} with status ${order.orderStatus} and delivery date: ${deliveryDate}`);
  
        // Vérification si la date de livraison est valide
        if (isNaN(deliveryDate.getTime())) {
          console.warn(`Invalid delivery date for order #${order.orderID}: ${order.deliveryDate}`);
          return false; // Ignore cette commande si la date est invalide
        }
  
        // Filtrage selon le statut et la date de livraison
        return relevantStatuses.includes(order.orderStatus?.toUpperCase()) &&
          deliveryDate.getTime() >= new Date().getTime(); // Vérifier si la date est dans le futur
      });
  
      console.log('Filtered Orders:', orders); // Log des commandes filtrées
  
      if (!orders.length) {
        Swal.fire({
          title: 'No Active Orders',
          text: 'No pending, confirmed or upcoming orders found for this supplier.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      // Préparer le contenu de l'email
      const subject = `URGENT: Order Confirmation Required (${supplier.name})`;
  
      const body = `
  Dear ${supplier.name},
  
  We would like to confirm the following active orders with your company:
  
  ${orders.map(order => `
  ORDER #${order.orderID}
  --------------------------------
  • Delivery Date: ${this.formatDate(order.deliveryDate)}
  • Ingredient: ${order.ingredient?.name || 'Not specified'}
  • Quantity: ${order.quantity} ${order.ingredient?.unit || 'units'}
  • Status: ${this.getStatusDisplay(order.orderStatus)}
  `).join('\n\n')}
  
  ACTION REQUIRED:
  1. Please confirm receipt of these orders
  2. Notify us of any expected delays
  3. Provide updated delivery timeline if needed
  
  For any questions, please contact our procurement team at:
  - Email: procurement@yourcompany.com
  - Phone: +123 456 7890
  
  We appreciate your prompt response.
  
  Best regards,
  Procurement Team
  Your Company Name
  `.trim();
  
      // Ouvrir le client email avec le sujet et le corps formatés
      this.openEmailClient(supplier.contactInfo, subject, body);
  
      // Affichage du message de succès
      Swal.fire({
        title: 'Email Prepared',
        text: 'The email has been prepared with order details. Please review before sending.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
    } catch (error) {
      console.error('Failed to process orders', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while preparing the email.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      this.isLoadingEmail = false;
    }
  }
  
  // Fonction pour formater la date de livraison
  private formatDate(date: string | Date): string {
    const deliveryDate = new Date(date);
    return deliveryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  private getStatusDisplay(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PENDING': 'Pending Confirmation',
      'CONFIRMED': 'Confirmed',
      'COMPLETED': 'Completed',
      'CANCELED': 'Canceled'
    };
    return statusMap[status.toUpperCase()] || status;
  }
  
  private openEmailClient(to: string, subject: string, body: string): void {
    const subjectEncoded = encodeURIComponent(subject);
    const bodyEncoded = encodeURIComponent(body);
    window.location.href = `mailto:${to}?subject=${subjectEncoded}&body=${bodyEncoded}`;
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}  