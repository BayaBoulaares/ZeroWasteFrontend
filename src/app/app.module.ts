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
    DashboardSidebarComponent



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
