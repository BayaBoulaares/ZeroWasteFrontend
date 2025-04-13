import { Component } from '@angular/core';

@Component({
  selector: '[appDashboardSidebar]',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {
  collapsed: boolean = false;

  menuItems = [
    { name: 'Users', label: 'Users', link: '/admin/usersmanagement', icon: 'bx bx-group', submenu:[] },
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
