import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }


  email: string = ''
  password: string = ''
  errorMessage: string = ''

  showPassword = false;

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
        this.router.navigate(['admin'])
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
}
