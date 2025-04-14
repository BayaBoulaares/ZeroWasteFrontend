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
import { DashboardComponent } from './features/StaffManagement/routes/admin/dashboard/dashboard.component';
import { EmployeeFormComponent } from './features/StaffManagement/routes/admin/employee/employee-form/employee-form.component';
import { EmployeeListComponent } from './features/StaffManagement/routes/admin/employee/employee-list/employee-list.component';
import { ShiftFormComponent } from './features/StaffManagement/routes/admin/shift/shift-form/shift-form.component';
import { ShiftListComponent } from './features/StaffManagement/routes/admin/shift/shift-list/shift-list.component';
import { TrainingSessionFormComponent } from './features/StaffManagement/routes/admin/training-session/training-session-form/training-session-form.component';
import { TrainingSessionListComponent } from './features/StaffManagement/routes/admin/training-session/training-session-list/training-session-list.component';
import { EmployeeProfileComponent } from './features/StaffManagement/routes/main/employee-profile/employee-profile.component';

const routes: Routes = [
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    children: [
      // 🍽 Meals Management
      {
        path: 'mealsmanagement',
        children: [
          { path: 'meals', component: MealsComponent },
          { path: 'ingredients', component: IngredientsComponent },
          { path: 'meals/add', component: AddMealComponent },
          { path: 'meals/update/:id', component: UpdateMealComponent },
          { path: 'ingredients/add', component: AddIngredientComponent },
          { path: 'ingredients/update/:id', component: UpdateIngredientComponent },
        ]
      },

      // 👨‍💼 Staff Management
      {
        path: 'staffmanagement',
        children: [
          { path: 'dashboard', component: DashboardComponent },

          // Employee routes
          { path: 'employees', component: EmployeeListComponent },
          { path: 'employees/new', component: EmployeeFormComponent },
          { path: 'employees/edit/:id', component: EmployeeFormComponent },

          // Shift routes
          { path: 'shifts', component: ShiftListComponent },
          { path: 'shifts/new', component: ShiftFormComponent },
          { path: 'shifts/edit/:id', component: ShiftFormComponent },

          // Training Session routes
          { path: 'training-sessions', component: TrainingSessionListComponent },
          { path: 'training-sessions/new', component: TrainingSessionFormComponent },
          { path: 'training-sessions/edit/:id', component: TrainingSessionFormComponent },
        ]
      }
    ]
  },

  // 🏠 Main site
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenusectionComponent },
      { path: 'staff-profile', component: EmployeeProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
