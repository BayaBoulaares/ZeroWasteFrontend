import { Component } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { Users } from '../../../Entities/users.model';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent {
  users: Users[] = [];
  searchTerm: string = '';
  alerts: { type: string, message: string }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers(): Promise<void> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    try {
      const data = await this.userService.getAllUsers(token);
      this.users = data.usersList;
     // console.log('Users:', data.usersList);
    } catch (error) {
      this.alerts.push({
        type: 'alert-danger',
        message: '❌ Failed to fetch users!'
      });
      console.error('Error fetching users:', error);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    try {
      await this.userService.deleteUser(String(userId), token);
      this.getUsers();
    } catch (error) {
      this.alerts.push({
        type: 'alert-danger',
        message: `❌ Failed to delete user with ID: ${userId}`
      });
    }
  }

  updateUser(userId: string): void {
    // You can navigate or open a modal here
    console.log('Update user with ID:', userId);
  }

  async searchUsers(): Promise<void> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    if (this.searchTerm.trim()) {
      try {
        const allUsers = await this.userService.getAllUsers(token);
        this.users = allUsers.filter((user: any) =>
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      this.getUsers();
    }
  }
}
