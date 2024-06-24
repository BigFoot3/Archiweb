import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  private userBaseUrl = 'http://localhost:3000/api/users';

  // Injection du HttpClient pour faire des requêtes HTTP
  constructor(private http: HttpClient) { }

  // Méthode pour gérer la connexion de l'utilisateur
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Méthode pour gérer l'inscription de l'utilisateur
  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { username, password });
  }

  // Méthode pour gérer la déconnexion de l'utilisateur
  logout(): void {
    localStorage.removeItem('token');
  }

  // Vérifie si l'utilisateur est connecté en vérifiant la présence du token
  public get loggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Vérifie si l'utilisateur est un administrateur en lisant le rôle dans le token
  public isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user.role === 'admin';
    }
    return false;
  }

  // Méthode privée pour obtenir les headers d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Méthode pour obtenir les détails de l'utilisateur connecté
  getUserDetails(): Observable<any> {
    const userId = this.getUserIdFromToken();
    console.log('ID utilisateur à partir du token:', userId);
    return this.http.get<any>(`${this.userBaseUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  // Méthode pour mettre à jour les détails de l'utilisateur connecté
  updateUser(user: any): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.put<any>(`${this.userBaseUrl}/${userId}`, user, { headers: this.getAuthHeaders() });
  }

  // Méthode privée pour extraire l'ID utilisateur à partir du token
  private getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload du token:', payload);
      return payload.user.id;
    }
    return '';
  }

  // Méthode publique pour obtenir l'ID utilisateur à partir du token
  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user.id;
  }
}
