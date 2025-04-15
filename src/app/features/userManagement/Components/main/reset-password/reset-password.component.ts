import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  password: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  async onSubmit() {
    if (!this.token) return;

    try {
      const res = await this.userService.resetPassword(this.token, this.password);
      this.message = res.message || 'Password successfully reset!';
      this.router.navigate(['home'])
    } catch (err: any) {
      this.message = err.error?.message || 'Error resetting password';
    }
  }
}
