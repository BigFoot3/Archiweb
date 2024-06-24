import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  errorMessage: string;

  // Injection du service d'authentification et du routeur
  constructor(private authService: AuthService, private router: Router) { }

  // Méthode pour gérer la connexion de l'utilisateur
  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      () => this.router.navigate(['/materials']),
      error => this.errorMessage = 'Nom d\'utilisateur ou mot de passe invalide'
    );
  }
}
