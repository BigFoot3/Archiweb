import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = 'http://localhost:3000/api/requests';

  // Injection du HttpClient pour faire des requêtes HTTP
  constructor(private http: HttpClient) { }

  // Méthode privée pour obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Méthode pour obtenir la liste des demandes
  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Méthode pour créer une nouvelle demande
  createRequest(materialId: string, location: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { materialId, location }, { headers: this.getAuthHeaders() });
  }

  // Méthode pour approuver une demande
  approveRequest(requestId: string, materialId: string, userId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${requestId}/approve`, { materialId, userId }, { headers: this.getAuthHeaders() });
  }

  // Méthode pour rejeter une demande
  rejectRequest(requestId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${requestId}/reject`, {}, { headers: this.getAuthHeaders() });
  }
}
