import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';
import { Users } from '../../../Entities/users.model';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {
  formdata: Users = new Users(0, '', '', '', '', false); // using your constructor

  roles: string[] = ['ADMIN', 'user'];
  token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getUserById(id);
    }
  }

  async getUserById(id: string) {

    try {
      const response = await this.userService.getUsersById(id, this.token);
      const data = response.user;
      console.log('User data:', data);
      this.formdata = new Users(
        data.id,
        data.email,
        data.name,
        data.city,
        data.role,
        data.enabled
      );
    } catch (err: any) {
      console.error('Error fetching user', err);
      alert('Error fetching user: ' + JSON.stringify(err.error?.message || err.message || err));
    }
  }


  async update() {
    try {
      await this.userService.updateUser(String(this.formdata.id), this.formdata, this.token);
      console.log('User updated successfully');
      //navigate to the users management page
      this.router.navigate(['/admin/usersmanagement']);
    } catch (error) {
      console.error('Error updating user', error);
      alert('Error updating user: ' + JSON.stringify(error));
    }

  }
}
