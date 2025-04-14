import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    city: '',
    role: 'user'
  };
  errorMessage: string = ''

  constructor(private userService: UserService, private router: Router) { }
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async handleRegister() {
    if (!this.user.name || !this.user.email || !this.user.password || !this.user.city) {
      this.showError("All fields are required");
      return;
    }

    try {
      const response = await this.userService.register(this.user);

      if (response.statusCode === 200) {
        //this.showSuccess("Registration successful. Please login.");
        this.router.navigate(['/login']);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(mess: string) {
    console.log('Error: ', mess);
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }

}
