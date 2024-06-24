import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MaterialsComponent } from './components/materials/material.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountComponent } from './components/account/account.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdminGuard } from './components/guards/admin.guard';
import { RequestManagementComponent } from './components/request-management/request-management.component';

// Définition des routes de l'application
const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route pour la page de connexion
  { path: 'register', component: RegisterComponent }, // Route pour la page d'inscription
  { path: 'account', component: AccountComponent }, // Route pour la page de gestion du compte
  { path: 'materials', component: MaterialsComponent }, // Route pour la page des matériaux
  { path: 'user-management', component: UserManagementComponent, canActivate: [AdminGuard] }, // Route pour la gestion des utilisateurs, protégée par un garde admin
  { path: 'request-management', component: RequestManagementComponent, canActivate: [AdminGuard] }, // Route pour la gestion des demandes, protégée par un garde admin
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Route par défaut redirigeant vers la page de connexion
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importation des routes dans le module de routage principal
  exports: [RouterModule] // Exportation du RouterModule configuré pour utilisation dans l'application
})
export class AppRoutingModule { }
