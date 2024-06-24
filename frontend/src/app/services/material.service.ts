import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = 'http://localhost:3000/api/materials';

  // Injection du HttpClient pour faire des requêtes HTTP
  constructor(private http: HttpClient) { }

  // Méthode privée pour obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Méthode pour obtenir la liste des matériels
  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Méthode pour obtenir les détails d'un matériel spécifique
  getMaterial(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Méthode pour ajouter un nouveau matériel
  addMaterial(material: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, material, { headers: this.getAuthHeaders() });
  }

  // Méthode pour mettre à jour un matériel existant
  updateMaterial(id: string, material: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, material, { headers: this.getAuthHeaders() });
  }

  // Méthode pour supprimer un matériel
  deleteMaterial(materialId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${materialId}`, { headers: this.getAuthHeaders() });
  }

  // Méthode pour assigner un matériel à un utilisateur ou une organisation
  assignMaterial(materialId: string, newLocation: string): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.post<any>(`${this.baseUrl}/${materialId}/assign`, { assigneeId: userId, assigneeType: 'User', location: newLocation }, { headers: this.getAuthHeaders() });
  }

  // Méthode pour gérer le retour d'un matériel
  returnMaterial(materialId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${materialId}/return`, {}, { headers: this.getAuthHeaders() });
  }

  // Méthode pour créer un nouveau matériel (sans header d'authentification)
  createMaterial(material: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, material);
  }

  // Méthode privée pour extraire l'ID utilisateur à partir du token
  private getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user.id;
    }
    return '';
  }
}
