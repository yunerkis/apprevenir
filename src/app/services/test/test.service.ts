import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs'; 
// import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  
  url = environment.url;
  testResult = new BehaviorSubject({});
  
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  
  getTestsList() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
    return this.http.get(`${this.url}/api/v1/tests`, {headers: headers});
  }

  getTest(id) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
    return this.http.get(`${this.url}/api/v1/tests/${id}`, {headers: headers});
  }

  storeAnswer(answer) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
    return this.http.post(`${this.url}/api/v1/users/answer`, answer, {headers: headers});
  }

  myResults() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
    const profile = JSON.parse(localStorage.getItem('profile'));
    return this.http.get(`${this.url}/api/v1/users/results/${profile.id}`, {headers: headers}); 
  }

  getAllResutls() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }) 
    return this.http.get(`${this.url}/api/v1/results/all`, {headers: headers}); 
  }

  image(filename) {

    return this.http.get(`${this.url}/image/${filename}`);
  }
}
