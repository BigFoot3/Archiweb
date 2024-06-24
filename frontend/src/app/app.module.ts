import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MaterialsComponent } from './components/materials/material.component';
import { RegisterComponent } from './components/register/register.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { RequestManagementComponent } from './components/request-management/request-management.component';
import { AccountComponent } from './components/account/account.component';

import { AuthService } from './services/auth.service';
import { MaterialService } from './services/material.service';
import { RequestService } from './services/request.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminGuard } from './components/guards/admin.guard';

@NgModule({
  declarations: [
    AppComponent, // Composant racine de l'application
    LoginComponent, // Composant pour la page de connexion
    MaterialsComponent, // Composant pour la gestion des matériaux
    RegisterComponent, // Composant pour la page d'inscription
    UserManagementComponent, // Composant pour la gestion des utilisateurs
    RequestManagementComponent, // Composant pour la gestion des demandes
    AccountComponent // Composant pour la gestion du compte utilisateur
  ],
  imports: [
    BrowserModule, // Nécessaire pour que l'application fonctionne dans un navigateur
    AppRoutingModule, // Module de routage de l'application
    FormsModule, // Module pour la gestion des formulaires
    HttpClientModule, // Module pour faire des requêtes HTTP
    RouterModule // Module pour le routage
  ],
  providers: [
    AuthService, // Service d'authentification
    MaterialService, // Service de gestion des matériaux
    RequestService, // Service de gestion des demandes
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Fournir l'intercepteur d'authentification pour les requêtes HTTP
    },
    AdminGuard, // Garde pour les routes nécessitant des privilèges administrateur
  ],
  bootstrap: [AppComponent] // Composant racine pour démarrer l'application
})
export class AppModule { }
