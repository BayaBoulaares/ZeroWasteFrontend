import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
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
import { StockStaticComponent } from './features/inventorymanagement/Components/admin/stock-static/stock-static.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    MainLayoutComponent,
    HomeComponent,
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



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgxPaginationModule,
    CommonModule,
    
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    FooterComponent,
    NavbarComponent,
    DashboardSidebarComponent,
    DashboardNavbarComponent,
  ]
})
export class AppModule { }
