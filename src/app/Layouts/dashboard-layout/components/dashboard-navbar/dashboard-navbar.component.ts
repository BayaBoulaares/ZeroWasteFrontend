import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/features/userManagement/Services/user.service';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent {
  constructor(private userService: UserService, private router: Router) { }

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;

  
    user = this.userService.getUser();
    //console.log('Connected user:', user.username);
  

  logout(): void {
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
    this.router.navigate(['/home']);
  }
}
