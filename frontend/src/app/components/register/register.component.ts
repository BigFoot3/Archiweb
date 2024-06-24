import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = {
    username: '',
    password: ''
  };
  errorMessage: string = '';

  // Injection du service d'authentification et du routeur
  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour gérer l'inscription de l'utilisateur
  register(): void {
    this.authService.register(this.user.username, this.user.password).subscribe(
      () => {
        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = error.error.message || 'Échec de l\'inscription. Veuillez réessayer.';
      }
    );
  }
}
