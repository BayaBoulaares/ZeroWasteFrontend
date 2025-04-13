import { Component } from '@angular/core';
import { ModalService } from './features/userManagement/Services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontOffice';
  showLogin = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.loginModalVisible$.subscribe(visible => {
      this.showLogin = visible;
    });
  }

  closeLogin() {
    this.modalService.closeLoginModal();
  }
}
