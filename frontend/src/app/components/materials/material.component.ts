import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-materials',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialsComponent implements OnInit {
  materials: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  newMaterial: any = {};
  userId: string | null = null;

  // Injection des services nécessaires pour la gestion des matériels et des demandes
  constructor(
    private materialService: MaterialService,
    private requestService: RequestService,
    private authService: AuthService
  ) { }

  // Initialisation du composant, chargement des matériels et récupération de l'ID de l'utilisateur
  ngOnInit(): void {
    this.loadMaterials();
    this.userId = this.authService.getUserId();
  }

  // Méthode pour charger la liste des matériels
  loadMaterials(): void {
    this.materialService.getMaterials().subscribe(
      data => {
        this.materials = data;
      },
      error => {
        this.errorMessage = 'Échec du chargement des matériels. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour assigner une demande de matériel
  assignRequest(material: any): void {
    if (!material.newLocation) {
      this.errorMessage = 'Veuillez fournir une localisation.';
      return;
    }

    this.requestService.createRequest(material._id, material.newLocation).subscribe(
      () => {
        this.successMessage = 'Demande envoyée avec succès.';
        this.loadMaterials(); // Recharger la liste des matériels après la demande
      },
      error => {
        this.errorMessage = 'Échec de l\'envoi de la demande. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour retourner un matériel
  returnMaterial(materialId: string): void {
    this.materialService.returnMaterial(materialId).subscribe(
      () => {
        this.successMessage = 'Matériel retourné avec succès.';
        this.loadMaterials();
      },
      error => {
        this.errorMessage = error.error.message || 'Échec du retour du matériel. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour supprimer un matériel
  deleteMaterial(materialId: string): void {
    this.materialService.deleteMaterial(materialId).subscribe(
      () => {
        this.successMessage = 'Matériel supprimé avec succès.';
        this.loadMaterials(); // Recharger la liste des matériels après la suppression
      },
      error => {
        this.errorMessage = error.error.message || 'Échec de la suppression du matériel. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour créer un nouveau matériel
  createMaterial(): void {
    this.materialService.createMaterial(this.newMaterial).subscribe(
      () => {
        this.successMessage = 'Matériel créé avec succès.';
        this.newMaterial = {}; // Réinitialiser le formulaire
        this.loadMaterials(); // Recharger la liste des matériels après la création
      },
      error => {
        this.errorMessage = error.error.message || 'Échec de la création du matériel. Veuillez réessayer.';
      }
    );
  }

  // Vérifie si l'utilisateur actuel est un administrateur
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
