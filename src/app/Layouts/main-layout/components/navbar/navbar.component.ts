import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/features/userManagement/Services/modal.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private modalService: ModalService,private userService: UserService, private router: Router) {}

  openLogin() {
    this.modalService.openLoginModal();
  }
  isLoggedIn(): boolean {
    return this.userService.isAuthenticated();
  }

  logout(): void {
    this.userService.logOut();
    this.router.navigate(['/home']);
  }
}
