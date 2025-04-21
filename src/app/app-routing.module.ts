import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './Layouts/main-layout/main-layout.component';
import { HomeComponent } from './Pages/home/home.component';
import { MenusectionComponent } from './features/menumangment/routes/main/menusection/menusection.component';
import { DashboardLayoutComponent } from './Layouts/dashboard-layout/dashboard-layout.component';
import { MealsComponent } from './features/menumangment/routes/admin/meals/meals.component';
import { IngredientsComponent } from './features/menumangment/routes/admin/ingredients/ingredients.component';
import { AddMealComponent } from './features/menumangment/routes/admin/add-meal/add-meal.component';
import { UpdateMealComponent } from './features/menumangment/routes/admin/update-meal/update-meal.component';
import { AddIngredientComponent } from './features/menumangment/routes/admin/add-ingredient/add-ingredient.component';
import { UpdateIngredientComponent } from './features/menumangment/routes/admin/update-ingredient/update-ingredient.component';
import { EmployeeFormComponent } from './features/StaffManagement/routes/admin/employee/employee-form/employee-form.component';
import { EmployeeListComponent } from './features/StaffManagement/routes/admin/employee/employee-list/employee-list.component';
import { ShiftFormComponent } from './features/StaffManagement/routes/admin/shift/shift-form/shift-form.component';
import { ShiftListComponent } from './features/StaffManagement/routes/admin/shift/shift-list/shift-list.component';
import { TrainingSessionFormComponent } from './features/StaffManagement/routes/admin/training-session/training-session-form/training-session-form.component';
import { TrainingSessionListComponent } from './features/StaffManagement/routes/admin/training-session/training-session-list/training-session-list.component';
import { EmployeeProfileComponent } from './features/StaffManagement/routes/main/employee-profile/employee-profile.component';
import { StaffDashboardComponent } from './features/StaffManagement/routes/admin/staff-dashboard/staff-dashboard.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UsersManagementComponent } from './features/userManagement/Components/admin/users-management/users-management.component';
import { UserUpdateComponent } from './features/userManagement/Components/admin/user-update/user-update.component';
import { UserCreateComponent } from './features/userManagement/Components/admin/user-create/user-create.component';
import { LoginComponent } from './features/userManagement/Components/admin/login/login.component';
import { noAuthGuard, adminGuard, userGuard } from './features/userManagement/Services/guards/user.guard';
import { RegisterComponent } from './features/userManagement/Components/admin/register/register.component';
import { LoginFComponent } from './features/userManagement/Components/main/login/login.component';
import { ResetPasswordComponent } from './features/userManagement/Components/main/reset-password/reset-password.component';
import { InventoryProductComponent } from './features/inventorymanagement/Components/admin/inventory-product/inventory-product.component';
import { ProductFormComponent } from './features/inventorymanagement/Components/admin/product-form/product-form.component';
import { StockTransactionComponent } from './features/inventorymanagement/Components/admin/stock-transaction/stock-transaction.component';
import { StockTransactionFormComponent } from './features/inventorymanagement/Components/admin/stock-transaction-form/stock-transaction-form.component';
import { ProductSectionComponent } from './features/inventorymanagement/Components/main/product-section/product-section/product-section.component';
import { StockStaticComponent } from './features/inventorymanagement/Components/admin/stock-static/stock-static.component';
import { AirecomendationComponent } from './features/menumangment/routes/admin/airecomendation/airecomendation.component';


import { EventComponent } from './features/Eventmanagement/routes/admin/event/event.component';
import { AddeventComponent } from './features/Eventmanagement/routes/admin/addevent/addevent.component';
import { UpdateeventComponent } from './features/Eventmanagement/routes/admin/updateevent/updateevent.component';
import { MenusComponent } from './features/Eventmanagement/routes/admin/menus/menus.component';
import { AddmenuComponent } from './features/Eventmanagement/routes/admin/addmenu/addmenu.component';
import { UpdatemenuComponent } from './features/Eventmanagement/routes/admin/updatemenu/updatemenu.component';
import { EventbackComponent } from './features/Eventmanagement/routes/admin/eventback/eventback/eventback.component';
import { AjoutComponent } from './features/Eventmanagement/routes/admin/ajout/ajout.component';
import { RegistrationModalComponent } from './features/Eventmanagement/routes/admin/event/registration-modal/registration-modal.component';
import { MenufrontComponent } from './features/Eventmanagement/routes/main/menufront/menufront.component';
import { AiDiscountDashboardComponent } from './features/Eventmanagement/routes/user/ai-discount-dashboard/ai-discount-dashboard.component';
import { EventPerformanceTrackerComponent } from './features/Eventmanagement/components/event-performance-tracker/event-performance-tracker.component';
import { ShiftRecommendationComponent } from './features/StaffManagement/routes/admin/shift-recommendation/shift-recommendation.component';

import { InvoiceComponent } from './features/invoiceManagement/Components/admin/invoice/invoice.component';
import { InvoiceCreateComponent } from './features/invoiceManagement/Components/admin/invoice-create/invoice-create.component';
import { InvoiceUpdateComponent } from './features/invoiceManagement/Components/admin/invoice-update/invoice-update.component';
import { CreateOrderComponent } from './features/orderManagement/Components/admin/create-order/create-order.component';
import { OrderListComponent } from './features/orderManagement/Components/admin/order-list/order-list.component';
import { SupplierListComponent } from './features/orderManagement/Components/admin/supplier-list/supplier-list.component';
import { SupplierOrdersComponent } from './features/orderManagement/Components/main/supplier-orders/supplier-orders.component';
import { ChatComponent } from './features/orderManagement/Components/main/chat/chat.component';
import { OrderDetailsComponent } from './features/orderManagement/Components/admin/order-details/order-details.component';
const routes: Routes = [
  //{ path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  {
    path: 'login', component: LoginFComponent, canActivate: [noAuthGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  {
    path: 'admin',
    component: DashboardLayoutComponent,
    // canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'mealsmanagement',
        children: [
          { path: 'meals', component: MealsComponent },
          { path: 'ingredients', component: IngredientsComponent },
          { path: 'meals/add', component: AddMealComponent },
          { path: 'meals/update/:id', component: UpdateMealComponent },
          { path: 'ingredients/add', component: AddIngredientComponent },
          { path: 'ingredients/update/:id', component: UpdateIngredientComponent },
          { path: 'meals/recemendation', component: AirecomendationComponent }

        ],

      },
      {
        path: 'staffmanagement',
        children: [
          { path: 'dashboard', component: StaffDashboardComponent },

          // Employee routes
          { path: 'employees', component: EmployeeListComponent },
          { path: 'employees/new', component: EmployeeFormComponent },
          { path: 'employees/edit/:id', component: EmployeeFormComponent },

          // Shift routes
          { path: 'shifts', component: ShiftListComponent },
          { path: 'shifts/new', component: ShiftFormComponent },
          { path: 'shifts/edit/:id', component: ShiftFormComponent },
          { path: 'shift-recommendations', component: ShiftRecommendationComponent },

          // Training Session routes
          { path: 'training-sessions', component: TrainingSessionListComponent },
          { path: 'training-sessions/new', component: TrainingSessionFormComponent },
          { path: 'training-sessions/edit/:id', component: TrainingSessionFormComponent },
        ]
      },
      { path: 'usersmanagement', component: UsersManagementComponent },
      { path: 'usersmanagement/update/:id', component: UserUpdateComponent },
      { path: 'usersmanagement/add', component: UserCreateComponent },

      {
        path: 'inventory',
        children: [
          { path: 'product', component: InventoryProductComponent },
          { path: 'product/add', component: ProductFormComponent },
          { path: 'product/update/:id', component: ProductFormComponent },
          { path: 'stockTransaction', component: StockTransactionComponent },
          { path: 'stockTransaction/add', component: StockTransactionFormComponent },
          { path: 'stockTransaction/update/:id', component: StockTransactionFormComponent },
          { path: 'stockStatic', component: StockStaticComponent },
          // {path: 'stockTransaction'},
        ]
      },
      {
        path: 'invoice',
        component: InvoiceComponent
      },
      { path: 'invoices/add', component: InvoiceCreateComponent },
      { path: 'invoices/update/:id', component: InvoiceUpdateComponent },
      {
        path: 'eventmanagement',
        children: [
          { path: 'events/add', component: AddeventComponent },
          { path: 'events/ajout', component: AjoutComponent },
          { path: 'events/update/:id', component: UpdateeventComponent },
          { path: 'menus/add', component: AddmenuComponent },
          { path: 'menus/update/:id', component: UpdatemenuComponent },
          { path: 'menus', component: MenusComponent },
          { path: 'events', component: EventbackComponent },
          { path: 'events/registration', component: RegistrationModalComponent},
          { path: 'event-performance', component: EventPerformanceTrackerComponent}
        ],
      },
         
      {
        path: 'orders/ordermanagement',   // Remarque le chemin modifié ici
  children: [
    { path: 'orders', component: OrderListComponent },
    { path: 'create-order', component: CreateOrderComponent },
    { path: 'suppliers', component: SupplierListComponent },
    // Route avec paramètre dynamique :id
    { path: 'orders/details/:id', component: OrderDetailsComponent }
         
          
        ]
      },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'events', component: EventComponent },
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenusectionComponent },
      { path: 'product', component: ProductSectionComponent },
      { path: 'staff-profile', component: EmployeeProfileComponent },
      { path: 'events', component: EventComponent },
      { path: 'event-menus', component: MenufrontComponent },
      { path: 'menus', component: MenusComponent },
      { path: 'ai-discount-events', component: AiDiscountDashboardComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'supplier/orders', component: SupplierOrdersComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
