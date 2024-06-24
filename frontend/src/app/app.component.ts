import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestion de stock';

  // Injection du service d'authentification et du routeur
  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour déconnecter l'utilisateur et rediriger vers la page d'accueil
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Getter pour vérifier si l'utilisateur est connecté
  get loggedIn(): boolean {
    return this.authService.loggedIn;
  }

  // Méthode pour vérifier si la route actuelle est la page de connexion ou d'inscription
  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  // Méthode pour vérifier si l'utilisateur actuel a des droits d'administration
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
