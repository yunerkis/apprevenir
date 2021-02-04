import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  url = environment.url;

  token = localStorage.getItem('token');

  profile = JSON.parse(localStorage.getItem('profile'));

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token
  })

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  getTestsList() {

    return this.http.get(`${this.url}/api/v1/tests`, {headers: this.headers});
  }

  getTest(id) {
   
    return this.http.get(`${this.url}/api/v1/tests/${id}`, {headers: this.headers});
  }

  storeAnswer(answer) {

    return this.http.post(`${this.url}/api/v1/users/answer`, answer, {headers: this.headers}).subscribe(
      res => {
        // return res['data']; this.testInfo.next(res['data']);
        // this.router.navigate(['test/test-result']);

      }, error => {

        if (error.error.data == 'disabled') {

          localStorage.removeItem('token');
          localStorage.removeItem('profile');
          // Swal.fire(
          //   'Error',
          //   error.error.data,
          //   'error'
          // )
          this.router.navigate(['/']);
        }
      });
  }

  myResults() {
        
    return this.http.get(`${this.url}/api/v1/users/results/${this.profile.id}`, {headers: this.headers}); 
  }

  image(filename) {

    return this.http.get(`${this.url}/image/${filename}`);
  }
}
