import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  // Injection du HttpClient pour faire des requêtes HTTP
  constructor(private http: HttpClient) { }

  // Méthode pour obtenir la liste des utilisateurs
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Méthode pour supprimer un utilisateur spécifique
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Méthode pour mettre à jour le rôle d'un utilisateur spécifique
  updateUserRole(id: string, role: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { role });
  }

  // Méthode pour créer un nouvel utilisateur
  createUser(user: any): Observable<void> {
    return this.http.post<void>(this.baseUrl, user);
  }
}
