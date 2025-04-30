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
import { RestaurantComponent } from './features/SafetyCompilance/Componets/admin/Restaurant/restaurant/restaurant.component';
import { SafetyInspectionComponent } from './features/SafetyCompilance/Componets/admin/SafetyInspection/safety-inspection/safety-inspection.component';
import { RestaurantDetailsComponent } from './features/SafetyCompilance/Componets/admin/Restaurant/restaurant-details/restaurant-details.component';
import { DetailsInspectionComponent } from './features/SafetyCompilance/Componets/admin/SafetyInspection/details-inspection/details-inspection.component';
import { UpdatesafetyinspectionComponent } from './features/SafetyCompilance/Componets/admin/SafetyInspection/updatesafetyinspection/updatesafetyinspection.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FrontinspectionComponent } from './features/SafetyCompilance/Componets/front/frontinspection/frontinspection.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';


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
    RestaurantComponent,
    SafetyInspectionComponent,
    RestaurantDetailsComponent,
    DetailsInspectionComponent,
    UpdatesafetyinspectionComponent,
    FrontinspectionComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    FullCalendarModule , // Add comma here
    MatDatepickerModule,
    MatNativeDateModule
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
