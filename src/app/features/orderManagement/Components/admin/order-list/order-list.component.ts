import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/order.service';
import { Order } from '../../../Entities/order.model';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'], // or .css depending on your file
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  count: any;
  isLoading = false;
  filteredOrders: Order[] = [];
  orderStatus: string[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
  searchQuery: string = '';
  newlyAddedOrderId: number | null = null;
  selectedSupplier: string = '';
  selectedStatus: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;// Page actuelle
  totalOrders = 0;
  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.getCountOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data.map(order => {
        if (Array.isArray(order.deliveryDate)) {
          order.deliveryDate = `${order.deliveryDate[0]}-${order.deliveryDate[1]}-${order.deliveryDate[2]}`;
        }
        return order;
      });
      this.totalOrders = this.orders.length;
      this.orders = this.orders.filter(o => o.quantity > 0 && o.deliveryDate && o.supplier && o.ingredient);
      this.applyFilters(); 
      this.updatePagination();// Applique les filtres après le chargement
    });
  }
 

  updatePagination() {
    // Applique les filtres avant la pagination
    this.applyFilters();
    
    // Pagination sur les résultats filtrés
    this.filteredOrders = this.filteredOrders.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
  }

  addNewOrder(newOrder: Order): void {
    if (Array.isArray(newOrder.deliveryDate)) {
      newOrder.deliveryDate = `${newOrder.deliveryDate[0]}-${newOrder.deliveryDate[1]}-${newOrder.deliveryDate[2]}`;
    }
    
    this.orders.unshift(newOrder);
    this.applyFilters(); // Met à jour les filtres après l'ajout
    this.getCountOrders(); // Met à jour le compteur
  }

  applyFilters(): void {
    this.filteredOrders = [...this.orders];

    // Filtre par statut
    if (this.selectedStatus) {
      this.filteredOrders = this.filteredOrders.filter(order => 
        order.orderStatus === this.selectedStatus
      );
    }

    // Filtre par fournisseur
    if (this.selectedSupplier) {
      this.filteredOrders = this.filteredOrders.filter(order => 
        order.supplier?.name === this.selectedSupplier
      );
    }

    // Filtre par recherche textuelle
    if (this.searchQuery.trim()) {
      this.filteredOrders = this.filteredOrders.filter(order => 
        (order.supplier?.name?.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (order.ingredient?.name?.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.selectedSupplier = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  getUniqueSuppliers(): string[] {
    const suppliers = this.orders
      .map(order => order.supplier?.name)
      .filter(name => name !== undefined) as string[];
    return [...new Set(suppliers)];
  }

  getButtonText(orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED'): string {
    switch (orderStatus) {
      case 'PENDING': return 'Mark Completed';
      case 'COMPLETED': return 'Mark Pending';
      case 'CANCELED': return 'Reinstate';
      case 'CONFIRMED': return 'Cancel Order';
      default: return 'Unknown Status';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-success';
      case 'PENDING': return 'bg-warning text-dark';
      case 'CANCELED': return 'bg-danger';
      case 'CONFIRMED': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }

  toggleOrderStatus(order: Order): void {
    if (!order.orderID) return;

    let newStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED';

    switch (order.orderStatus) {
      case 'PENDING': newStatus = 'COMPLETED'; break;
      case 'COMPLETED': newStatus = 'PENDING'; break;
      case 'CANCELED': newStatus = 'CONFIRMED'; break;
      case 'CONFIRMED': newStatus = 'CANCELED'; break;
      default: return;
    }

    const parts = order.deliveryDate.split('-');
    const dateArray = [
      parseInt(parts[0], 10),
      parseInt(parts[1], 10),
      parseInt(parts[2], 10),
      0, 0
    ];

    const updatedOrder = { ...order, deliveryDate: dateArray, orderStatus: newStatus };

    this.orderService.updateOrderStatus(order.orderID, updatedOrder).subscribe({
      next: () => {
        order.orderStatus = newStatus;
        this.applyFilters(); // Met à jour les filtres après modification
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.orders = this.orders.filter(o => o.orderID !== id);
        this.applyFilters(); // Met à jour les filtres après suppression
        this.getCountOrders(); // Met à jour le compteur
      });
    }
  }

  viewOrderDetails(order: Order): void {
    this.router.navigate(['/orders', order.orderID]);
  }

  getCountOrders(): void {
    this.orderService.getCountOrders().subscribe({
      next: (res) => this.count = res,
      error: (err) => console.error('Error getting count', err)
    });
  }
}