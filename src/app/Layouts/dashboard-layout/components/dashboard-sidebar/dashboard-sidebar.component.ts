import { Component } from '@angular/core';

@Component({
  selector: '[appDashboardSidebar]',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {
  collapsed: boolean = false;

  menuItems = [
    {
      name: 'menuItems', 
      label: 'Menu Management', 
      link: '#', 
      icon: 'bx bx-food-menu', 
      submenu: [
        { label: 'Meals', link: '/admin/mealsmanagement/meals' },
        { label: 'Ingredients', link: '/admin/mealsmanagement/ingredients' }
      ]
    },
    {
      name: 'staffItems', 
      label: 'Staff Management', 
      link: '#', 
      icon: 'bx bx-user', 
      submenu: [
        { label: 'Dashboard', link: '/admin/staffmanagement/dashboard' },
        { label: 'Employees', link: '/admin/staffmanagement/employees' },
        { label: 'Shifts', link: '/admin/staffmanagement/shifts' },
        { label: 'Training Sessions', link: '/admin/staffmanagement/training-sessions' }
      ]
    }
    // Add other menu items as needed
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}