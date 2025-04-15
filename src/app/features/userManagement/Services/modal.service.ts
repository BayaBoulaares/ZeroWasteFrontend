import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  private loginModalVisible = new BehaviorSubject<boolean>(false);
  loginModalVisible$ = this.loginModalVisible.asObservable();

  openLoginModal() {
    this.loginModalVisible.next(true);
  }

  closeLoginModal() {
    this.loginModalVisible.next(false);
  }
}
