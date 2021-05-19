import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { storeAuhToken, clearAuthStore, storeProfileInfo } from "./authStore";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;

  token = localStorage.getItem('token');

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token
  })

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  login(credentials) {

    return this.http.post(`${this.url}/api/v1/login`, credentials).subscribe(
      res => {
        const accessToken = res["data"].access_token;
        const profileObject = res["data"].profile;
        const referrerConfig = res["data"].referrer_config;
        const userRole = res["data"].role;
        profileObject.email = credentials["email"]; // Bruh...
        profileObject.role = userRole;

        storeAuhToken(accessToken);
        storeProfileInfo(profileObject, referrerConfig);

        this.router.navigate(['app/home']); 
      }, error => {
        const errorMessage = 
          error.error?.data || 
          "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";

        Swal.fire(
          'Error',
          errorMessage,
          'error'
        );
      });
  }

  recovery(email) {
    
    return this.http.post(`${this.url}/api/v1/reset-password`, email).subscribe(
      res => {
        Swal.fire('Email enviado', 'Por favor revisar su correo electrónico', "success");
        this.router.navigate(['/']); 
      },
      error => {
        const errorMessage = 
          error.error?.data || 
          "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";

        Swal.fire(
          'Error',
          errorMessage,
          'error'
        );
      });
  }

  recoveryPassword(password) {
    return this.http.put(`${this.url}/api/v1/reset-password`, password).subscribe(
      res => {
        Swal.fire('Cambio de contraseña exitosa', 'Por favor revisar su correo electrónico', "success");
        this.router.navigate(['/']); 
      },
      error => {
        const errorMessage = 
          error.error?.data || 
          "No fue posible contactar al servidor. Por favor revisa tu conexión a internet e inténtalo de nuevo";

        Swal.fire(
          'Error',
          errorMessage,
          'error'
        );
      });
  }

  logout() {
    clearAuthStore();
    this.router.navigate(['/']);

    // We really don't care at all if this request is successful or not:
    // We already deleted the auth info from local storage 🤷 
    this.http.get(`${this.url}/api/v1/logout`, {headers: this.headers});
  }
}
