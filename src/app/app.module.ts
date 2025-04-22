import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Layouts/main-layout/components/navbar/navbar.component';
import { FooterComponent } from './Layouts/main-layout/components/footer/footer.component';
import { MainLayoutComponent } from './Layouts/main-layout/main-layout.component';
import { HomeComponent } from './Pages/home/home.component';
import { MenusectionComponent } from './features/menumangment/routes/main/menusection/menusection.component';
import { AddMealComponent } from './features/menumangment/routes/admin/add-meal/add-meal.component';
import { MealsComponent } from './features/menumangment/routes/admin/meals/meals.component';
import { UpdateMealComponent } from './features/menumangment/routes/admin/update-meal/update-meal.component';
import { AddIngredientComponent } from './features/menumangment/routes/admin/add-ingredient/add-ingredient.component';
import { UpdateIngredientComponent } from './features/menumangment/routes/admin/update-ingredient/update-ingredient.component';
import { IngredientsComponent } from './features/menumangment/routes/admin/ingredients/ingredients.component';
import { DashboardSidebarComponent } from './Layouts/dashboard-layout/components/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardNavbarComponent } from './Layouts/dashboard-layout/components/dashboard-navbar/dashboard-navbar.component';
import { DashboardMenuItemComponent } from './Layouts/dashboard-layout/components/dashboard-menu-item/dashboard-menu-item.component';
import { DashboardLayoutComponent } from './Layouts/dashboard-layout/dashboard-layout.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { LoginComponent } from './features/userManagement/Components/admin/login/login.component';
import { RegisterComponent } from './features/userManagement/Components/admin/register/register.component';
import { UsersManagementComponent } from './features/userManagement/Components/admin/users-management/users-management.component';
import { UserUpdateComponent } from './features/userManagement/Components/admin/user-update/user-update.component';
import { UserCreateComponent } from './features/userManagement/Components/admin/user-create/user-create.component';
import { LoginFComponent } from './features/userManagement/Components/main/login/login.component';
import { ResetPasswordComponent } from './features/userManagement/Components/main/reset-password/reset-password.component';

import { ProductFormComponent } from './features/inventorymanagement/Components/admin/product-form/product-form.component';

import { StockTransactionFormComponent } from './features/inventorymanagement/Components/admin/stock-transaction-form/stock-transaction-form.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InventoryProductComponent } from './features/inventorymanagement/Components/admin/inventory-product/inventory-product.component';
import { Product } from './features/inventorymanagement/Entities/product';
import { StockTransactionComponent } from './features/inventorymanagement/Components/admin/stock-transaction/stock-transaction.component';
import { ProductSectionComponent } from './features/inventorymanagement/Components/main/product-section/product-section/product-section.component';
import { CommonModule } from '@angular/common';
import { VoiceSearchComponent } from './features/Eventmanagement/routes/main/menufront/voice-search/voice-search.component';
import { VoiceSearchService } from './features/Eventmanagement/Services/voice-search.service';
import { StockStaticComponent } from './features/inventorymanagement/Components/admin/stock-static/stock-static.component';
import { EmployeeFormComponent } from './features/StaffManagement/routes/admin/employee/employee-form/employee-form.component';
import { EmployeeListComponent } from './features/StaffManagement/routes/admin/employee/employee-list/employee-list.component';
import { ShiftFormComponent } from './features/StaffManagement/routes/admin/shift/shift-form/shift-form.component';
import { ShiftListComponent } from './features/StaffManagement/routes/admin/shift/shift-list/shift-list.component';
import { TrainingSessionFormComponent } from './features/StaffManagement/routes/admin/training-session/training-session-form/training-session-form.component';
import { TrainingSessionListComponent } from './features/StaffManagement/routes/admin/training-session/training-session-list/training-session-list.component';
import { EmployeeProfileComponent } from './features/StaffManagement/routes/main/employee-profile/employee-profile.component';
import { EmployeeInfoComponent } from './features/StaffManagement/routes/main/employee-info/employee-info.component';
import { EmployeeShiftsComponent } from './features/StaffManagement/routes/main/employee-shifts/employee-shifts.component';
import { EmployeeTrainingComponent } from './features/StaffManagement/routes/main/employee-training/employee-training.component';
import { EmployeeShiftRequestsComponent } from './features/StaffManagement/routes/main/employee-shift-requests/employee-shift-requests.component';
import { StaffDashboardComponent } from './features/StaffManagement/routes/admin/staff-dashboard/staff-dashboard.component';
import { AirecomendationComponent } from './features/menumangment/routes/admin/airecomendation/airecomendation.component';
import { EventComponent } from './features/Eventmanagement/routes/admin/event/event.component';
import { MenusComponent } from './features/Eventmanagement/routes/admin/menus/menus.component';
import { AddeventComponent } from './features/Eventmanagement/routes/admin/addevent/addevent.component';
import { AddmenuComponent } from './features/Eventmanagement/routes/admin/addmenu/addmenu.component';
import { UpdateeventComponent } from './features/Eventmanagement/routes/admin/updateevent/updateevent.component';
import { UpdatemenuComponent } from './features/Eventmanagement/routes/admin/updatemenu/updatemenu.component';
import { EventService } from './features/Eventmanagement/Services/event.service';
import { MenusService } from './features/Eventmanagement/Services/menus.service';
import { EventbackComponent } from './features/Eventmanagement/routes/admin/eventback/eventback/eventback.component';
import { UploadComponent } from './features/Eventmanagement/routes/upload/upload.component';
import { AjoutComponent } from './features/Eventmanagement/routes/admin/ajout/ajout.component';
import { RegistrationModalComponent } from './features/Eventmanagement/routes/admin/event/registration-modal/registration-modal.component';
import { EmailService } from './features/Eventmanagement/Services/email.service';
import { QRCodeService } from './features/Eventmanagement/Services/qrcode.service';
import { AiDiscountService } from './features/Eventmanagement/Services/ai-discount.service';
import { AiDiscountCardComponent } from './features/Eventmanagement/components/ai-discount-card/ai-discount-card.component';
import { AiDiscountDashboardComponent } from './features/Eventmanagement/routes/user/ai-discount-dashboard/ai-discount-dashboard.component';
import { EventAnalyticsService } from './features/Eventmanagement/Services/event-analytics.service';
import { EventPerformanceTrackerComponent } from './features/Eventmanagement/components/event-performance-tracker/event-performance-tracker.component';
import { InvoiceComponent } from './features/invoiceManagement/Components/admin/invoice/invoice.component';
import { InvoiceCreateComponent } from './features/invoiceManagement/Components/admin/invoice-create/invoice-create.component';
import { InvoiceUpdateComponent } from './features/invoiceManagement/Components/admin/invoice-update/invoice-update.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    MainLayoutComponent,
    HomeComponent,
    VoiceSearchComponent,
    MenusectionComponent,
    AddMealComponent,
    MealsComponent,
    UpdateMealComponent,
    AddIngredientComponent,
    UpdateIngredientComponent,
    IngredientsComponent,
    DashboardLayoutComponent,
    DashboardMenuItemComponent,
    DashboardNavbarComponent,
    DashboardSidebarComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    ShiftListComponent,
    ShiftFormComponent,
    TrainingSessionListComponent,
    TrainingSessionFormComponent,
    EmployeeProfileComponent,
    EmployeeInfoComponent,
    EmployeeShiftsComponent,
    EmployeeTrainingComponent,
    EmployeeShiftRequestsComponent,
    StaffDashboardComponent,
    DashboardComponent,
    DashboardSidebarComponent,
    LoginComponent,
    RegisterComponent,
    UsersManagementComponent,
    UserUpdateComponent,
    UserCreateComponent,
    LoginFComponent,
    ResetPasswordComponent,
    InventoryProductComponent,
    ProductFormComponent,
    StockTransactionComponent,
    StockTransactionFormComponent,
    ProductSectionComponent,
    StockStaticComponent,
    AirecomendationComponent,



    InvoiceComponent,
    InvoiceCreateComponent,
    InvoiceUpdateComponent,


    EventComponent,
    MenusComponent,
    AddeventComponent,
    AddmenuComponent,
    UpdateeventComponent,
    UpdatemenuComponent,
    EventComponent,
    MenusComponent,
    AddeventComponent,
    AddmenuComponent,
    UpdateeventComponent,
    UpdatemenuComponent,
    EventbackComponent,
    UploadComponent,
    AjoutComponent,
    RegistrationModalComponent,
    AiDiscountCardComponent,
    AiDiscountDashboardComponent,
    EventPerformanceTrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    NgChartsModule,
    NgxPaginationModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    VoiceSearchService,
    EmailService,
    QRCodeService,
    AiDiscountService,
    EventAnalyticsService
  ],
  bootstrap: [AppComponent],
  exports: [
    FooterComponent,
    NavbarComponent,
    DashboardSidebarComponent,
    DashboardNavbarComponent,
    VoiceSearchComponent
  ]
})
export class AppModule { }