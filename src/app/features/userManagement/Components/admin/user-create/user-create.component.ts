import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';
import { Users } from '../../../Entities/users.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent {
  formdata: Users = new Users(0, '', '', '', '', false,''); // using your constructor
  
    roles: string[] = ['ADMIN', 'user'];
    token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    emailTakenError: string | null = null;

    
    constructor(
      private userService: UserService,
      private router: Router,
    ) { }
  
  
  
    showPassword = false;

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
    async create() {
      this.emailTakenError = null; // clear old error before retry
    
      try {
        const response = await this.userService.createUser(this.formdata, this.token);
    
        if (response.statusCode === 201) {
          this.router.navigate(['/admin/usersmanagement']);
        } else {
          if (response.statusCode === 400 && response.message.includes('already exists')) {
            this.emailTakenError = response.message;
          } else {
            console.error(response.message);
          }
        }
      } catch (error: any) {
        console.error('Unexpected error:', error);
        this.emailTakenError = 'An unexpected error occurred.';
      }
    }
    
}
