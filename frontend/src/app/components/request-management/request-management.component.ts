import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-management',
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.css']
})
export class RequestManagementComponent implements OnInit {
  requests: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  // Injection du service de gestion des demandes
  constructor(private requestService: RequestService) { }

  // Initialisation du composant, chargement des demandes au démarrage
  ngOnInit(): void {
    this.loadRequests();
  }

  // Méthode pour charger la liste des demandes
  loadRequests(): void {
    this.requestService.getRequests().subscribe(
      data => {
        this.requests = data;
      },
      error => {
        this.errorMessage = 'Échec du chargement des demandes. Veuillez réessayer.';
      }
    );
  }

  // Méthode pour approuver une demande
  approveRequest(request: any): void {
    if (!request || !request.material || !request.material._id || !request.user || !request.user._id) {
      this.errorMessage = 'Données de demande invalides';
      return;
    }

    this.requestService.approveRequest(request._id, request.material._id, request.user._id).subscribe(
      (response) => {
        this.successMessage = response.message || 'Demande approuvée avec succès.';
        this.errorMessage = '';
        this.loadRequests();
      },
      error => {
        console.error('Erreur lors de l\'approbation de la demande:', error);
        this.errorMessage = error.error.message || 'Échec de l\'approbation de la demande. Veuillez réessayer.';
        this.successMessage = '';
      }
    );
  }

  // Méthode pour rejeter une demande
  rejectRequest(request: any): void {
    if (!request || !request._id) {
      this.errorMessage = 'Données de demande invalides';
      return;
    }

    this.requestService.rejectRequest(request._id).subscribe(
      (response) => {
        this.successMessage = response.message || 'Demande rejetée avec succès.';
        this.errorMessage = '';
        this.loadRequests();
      },
      error => {
        console.error('Erreur lors du rejet de la demande:', error);
        this.errorMessage = error.error.message || 'Échec du rejet de la demande. Veuillez réessayer.';
        this.successMessage = '';
      }
    );
  }
}
