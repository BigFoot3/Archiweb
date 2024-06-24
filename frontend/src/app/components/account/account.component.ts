import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: any = {};
  errorMessage: string = '';

  // Injection du service d'authentification pour interagir avec l'API
  constructor(private authService: AuthService) { }

  // Initialisation du composant, chargement des détails de l'utilisateur au démarrage
  ngOnInit(): void {
    this.loadUser();
  }

  // Méthode pour charger les détails de l'utilisateur
  loadUser(): void {
    this.authService.getUserDetails().subscribe(
      data => this.user = data,
      error => this.errorMessage = error.message
    );
  }

  // Méthode pour mettre à jour les détails de l'utilisateur
  updateUser(): void {
    this.authService.updateUser(this.user).subscribe(
      () => {
        this.errorMessage = '';
        alert('Les détails de l\'utilisateur ont été mis à jour avec succès !');
      },
      error => {
        this.errorMessage = error.error.message || 'Échec de la mise à jour des détails de l\'utilisateur. Veuillez réessayer.';
      }
    );
  }
}
