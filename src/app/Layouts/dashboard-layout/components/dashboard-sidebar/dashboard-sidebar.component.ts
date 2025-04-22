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

    { name: 'Users', label: 'Users', link: '/admin/usersmanagement', icon: 'bx bx-group', submenu:[] },
    {
      name: 'menuItems', 
      label: 'Menu Management',
      link: '#',
      icon: 'bx bx-food-menu',
      submenu: [
        { label: 'Meals', link: '/admin/mealsmanagement/meals' },
        { label: 'Ingredients', link: '/admin/mealsmanagement/ingredients' },
        { label: 'Recommendation', link: '/admin/mealsmanagement/meals/recemendation' }
      ]
    },
    { name: 'Invoices', label: 'Invoices', link: '/admin/invoice', icon: 'bx bx-food-menu', submenu:[] },
    {
      name: 'inventory', label: 'Inventory Management', link: '#', icon: 'bx bx-trending-up', submenu: [
        { label: 'Product', link: '/admin/inventory/product' },

        { label: 'Stock Transaction', link: '/admin/inventory/stockTransaction' },
        //{ label: 'Stock Static', link: '/admin/inventory/stockStatic' },
        
      ]
    },
    
    {
      name: 'staffItems', 
      label: 'Staff Management', 
      link: '#', 
      icon: 'bx bx-user', 
      submenu: [
        { label: 'Staff Dashboard', link: '/admin/staffmanagement/dashboard' },
        { label: 'Employees', link: '/admin/staffmanagement/employees' },
        { label: 'Shifts', link: '/admin/staffmanagement/shifts' },
        { label: 'Training Sessions', link: '/admin/staffmanagement/training-sessions' }
      ]
    },
    // Add other menu items as needed
    {
      name: 'eventItems',
      label: 'Event Management',
      link: '#',
      icon: 'bx bx-calendar-event', // Changed icon to be more appropriate for events
      submenu: [
        { label: 'Events', link: '/admin/eventmanagement/events' },
        { label: 'Menus', link: '/admin/eventmanagement/menus' }
      ]
    },
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}