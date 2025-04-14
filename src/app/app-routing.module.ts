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

const routes: Routes = [
  {
    path: 'admin',
    component: DashboardLayoutComponent,
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
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'menu', component: MenusectionComponent },

    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
