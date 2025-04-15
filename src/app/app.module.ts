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
    StaffDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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