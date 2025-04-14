import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'appF-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginFComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) {
    console.log('LoginComponent initialized!');

   }
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  email: string = ''
  password: string = ''
  errorMessage: string = ''

  showPassword = false;
  isSignup = false;

  toggleFormMode() {
    this.isSignup = !this.isSignup;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async handleSubmit() {

    if (!this.email || !this.password) {
      this.showError("Email and Password is required");
      return
    }

    try {
      const response = await this.userService.login(this.email, this.password);
      if (response.statusCode == 200) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.role)
        localStorage.setItem('user', JSON.stringify(response.user));
        //this.router.navigate(['home'])
        if (response.role === 'ADMIN') {
          console.log('Admin logged in');
          this.router.navigate(['admin']);
        }
        this.closeModal();
        
        /* console.log(localStorage.getItem('token',))
        console.log(localStorage.getItem('role',)) */
        console.log(localStorage.getItem('user',))
      } else {
        this.showError(response.message)
      }
    } catch (error: any) {
      this.showError(error.message)
    }

  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }


  //////////// sign up //////////////

  signupData = {
    name: '',
    email: '',
    password: '',
    city: '',
    role: 'user'
  };
  
  async handleRegister() {
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password || !this.signupData.city) {
      this.showError("All fields are required");
      return;
    }
  
    
    try {
      const response = await this.userService.register(this.signupData);
      if (response.statusCode === 201) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.toggleFormMode();
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }
  
}
