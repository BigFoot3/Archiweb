import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Intercepte les requêtes HTTP sortantes pour ajouter un jeton d'authentification
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Récupérer le jeton d'authentification depuis le localStorage
    if (token) {
      // Cloner la requête et ajouter le header Authorization si le jeton est présent
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    // Passer la requête suivante dans la chaîne des intercepteurs
    return next.handle(request);
  }
}
