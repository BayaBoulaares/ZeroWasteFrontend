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
      name: 'dashboard', label: 'Dashboard', link: '/admin/dashboard', icon: 'bx bx-home-circle', submenu: []
    },

    {
      name: 'menuItems', label: 'Menu Management', link: '#', icon: 'bx bx-food-menu', submenu: [
        { label: 'Meals', link: '/admin/mealsmanagement/meals' },
        { label: 'Ingredients', link: '/admin/mealsmanagement/ingredients' }
      ]
    },
    // Add other menu items as needed
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
