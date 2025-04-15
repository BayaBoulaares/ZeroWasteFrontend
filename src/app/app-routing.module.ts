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
      {path:'dashboard',component:DashboardComponent},
      {
        path: 'mealsmanagement',
        children: [
          { path: 'meals', component: MealsComponent },
          { path: 'ingredients', component: IngredientsComponent },
          { path: 'meals/add', component: AddMealComponent },
          { path: 'meals/update/:id', component: UpdateMealComponent },
          { path: 'ingredients/add', component: AddIngredientComponent },
          { path: 'ingredients/update/:id', component: UpdateIngredientComponent },

        ],
      }, 
      { path: 'usersmanagement', component: UsersManagementComponent },
      { path: 'usersmanagement/update/:id', component: UserUpdateComponent },
      { path: 'usersmanagement/add', component: UserCreateComponent },

      { path: 'inventory',
        children: [
          {path: 'product', component: InventoryProductComponent},
          {path: 'product/add', component: ProductFormComponent},
          {path: 'product/update/:id', component: ProductFormComponent},
          {path: 'stockTransaction', component: StockTransactionComponent},
          {path: 'stockTransaction/add', component: StockTransactionFormComponent},
          {path: 'stockTransaction/update/:id', component: StockTransactionFormComponent},
          {path: 'stockStatic', component: StockStaticComponent},
          // {path: 'stockTransaction'},
    ]}
    ],
  },
  
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenusectionComponent },
      { path: 'product', component: ProductSectionComponent }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
