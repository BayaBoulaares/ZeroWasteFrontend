import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '[appDashboardMenuItem]',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.scss']
})
export class DashboardMenuItemComponent {

  @Input() menu: any;  // Menu item data
  @Input() isActive: boolean = false; // Check if the item is active
  @Input() collapsed: boolean = false; // Track collapse state of the menu
  
  constructor(private router: Router) {}

  toggleMenu(menu: string) {
    this.collapsed = !this.collapsed;
  }

  isMenuOpen(menu: string): boolean {
    return this.collapsed;
  }

  isLinkActive(link: string): boolean {
    return this.router.url.includes(link);
  }
}