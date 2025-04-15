import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/features/inventorymanagement/Services/cart.service';
import { ModalService } from 'src/app/features/userManagement/Services/modal.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.orderCount$.subscribe(count => {
      this.orderCount = count;
    });

    this.cartService.orderedProducts$.subscribe(products => {
      this.orderedProducts = products;
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
  
}
