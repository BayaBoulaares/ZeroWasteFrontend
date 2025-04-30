import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/features/inventorymanagement/Services/cart.service';
import { ModalService } from 'src/app/features/userManagement/Services/modal.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';
import { Router } from '@angular/router';
import { Invoice, InvoiceItem } from 'src/app/features/invoiceManagement/Entities/invoice.model';
import { InvoiceService } from 'src/app/features/invoiceManagement/Services/invoice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  orderCount: number = 0;
  showCartPopup: boolean = false;
  orderedProducts: any[] = [];

  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
    private invoiceService: InvoiceService
  ) { }

  
  user: any;
profileImageUrl: string = '';
defaultImageUrl: string = 'https://res.cloudinary.com/dmdvu18ki/image/upload/v1745759200/noImage_nhztmy.png';

ngOnInit(): void {
  this.cartService.orderCount$.subscribe(count => {
    this.orderCount = count;
  });

  this.cartService.orderedProducts$.subscribe(products => {
    this.orderedProducts = products;
  });

  this.user = this.userService.getUser();
  this.profileImageUrl = this.user?.image ? this.user.image : this.defaultImageUrl;
}
orderSuccess = false;


  onPay(): void {
    if (!this.isLoggedIn()) {
      this.modalService.openLoginModal();
      return;
    }

    const user = this.userService.getUser(); 
    const items: InvoiceItem[] = this.orderedProducts.map(item => ({
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.orderKg
    }));

    const invoice: Invoice = {
      date: new Date().toISOString(),
      status: 'PAID',
      user: { id: user.id },
      items
    };
    console.log('Invoice:', invoice); 
    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        this.invoiceService.getInvoicePdf(String(invoice.id)); 
        this.orderSuccess = true;
        this.cartService.clearOrders();
        setTimeout(() => {
          this.orderSuccess = false;
          this.toggleCartPopup();
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: err => {
        console.error('Failed to create invoice:', err);
      }
    });
  }


toggleCartPopup(): void {
  this.showCartPopup = !this.showCartPopup;
}

openLogin(): void {
  this.modalService.openLoginModal();
}

isLoggedIn(): boolean {
  return this.userService.isAuthenticated();
}

logout(): void {
  this.userService.logOut();
  this.router.navigate(['/home']);
}
removeFromCart(productId: number): void {
  this.cartService.removeOrder(productId);
}
  get totalPrice(): number {
  return this.orderedProducts.reduce((total, item) => {
    return total + (item.orderKg * item.productPrice);
  }, 0);
}

isEmployee(): boolean {
  if (this.user) {
    return this.user.role === 'EMPLOYEE' ;
  }
  return false;
}
  
}
