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
import { noAuthGuard , adminGuard, userGuard } from './features/userManagement/Services/guards/user.guard';
import { RegisterComponent } from './features/userManagement/Components/admin/register/register.component';
import { LoginFComponent } from './features/userManagement/Components/main/login/login.component';
import { SafetyInspectionComponent } from './features/SafetyCompilance/Componets/admin/SafetyInspection/safety-inspection/safety-inspection.component';
import { RestaurantComponent } from './features/SafetyCompilance/Componets/admin/Restaurant/restaurant/restaurant.component';
import { RestaurantDetailsComponent } from './features/SafetyCompilance/Componets/admin/Restaurant/restaurant-details/restaurant-details.component';
import { SafetyInspectionService } from './features/SafetyCompilance/Services/safety-inspection.service';
import { DetailsInspectionComponent } from './features/SafetyCompilance/Componets/admin/SafetyInspection/details-inspection/details-inspection.component';
import { UpdatesafetyinspectionComponent } from './features/SafetyCompilance/Componets/admin/SafetyInspection/updatesafetyinspection/updatesafetyinspection.component';
import { FrontinspectionComponent } from './features/SafetyCompilance/Componets/front/frontinspection/frontinspection.component';

const routes: Routes = [
  //{ path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  {
    path: 'login', component: LoginFComponent, canActivate: [noAuthGuard],
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [adminGuard],
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
    ],
  },

  {
    path: 'admin',
    component: DashboardLayoutComponent,
  
    children: [
      {
        path: 'SafetyManagment',
        children: [
          { path: 'SafetyInspection', component: SafetyInspectionComponent },
          
          { path: 'SafetyInspectionDetails/:id', component: DetailsInspectionComponent },
          { path: 'SafetyInspectionUpdate/:id', component: UpdatesafetyinspectionComponent },
         
        ],
      },
      {
        path: 'RestaurantManagment',
        children: [
          { path: 'Restaurant', component: RestaurantComponent },
          { path: 'RestaurantDetails/:id', component: RestaurantDetailsComponent },
         
        ],
      },
    //  { path: 'usersmanagement/update/:id', component: UserUpdateComponent },

    ],
  },


  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenusectionComponent },
      { path: 'inspection', component: FrontinspectionComponent },

    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
