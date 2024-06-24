import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  newUser: any = { username: '', password: '', role: 'user' };
  errorMessage: string = '';

  // Injection du service de gestion des utilisateurs
  constructor(private userService: UserService) { }

  // Initialisation du composant, chargement des utilisateurs au démarrage
  ngOnInit(): void {
    this.loadUsers();
  }

  // Méthode pour charger la liste des utilisateurs
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        this.errorMessage = 'Échec du chargement des utilisateurs. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter(user => user._id !== id);
      },
      error => {
        this.errorMessage = 'Échec de la suppression de l\'utilisateur. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour mettre à jour le rôle d'un utilisateur
  updateRole(id: string, role: string): void {
    this.userService.updateUserRole(id, role).subscribe(
      () => {
        this.loadUsers();
      },
      error => {
        this.errorMessage = 'Échec de la mise à jour du rôle. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour créer un nouvel utilisateur
  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(
      () => {
        this.loadUsers();
        this.newUser = { username: '', password: '', role: 'user' };
      },
      error => {
        this.errorMessage = 'Échec de la création de l\'utilisateur. Veuillez réessayer.';
      }
    );
  }
}
