import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { storedAuthTokenIsValid } from "./authStore";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router : Router,
  ) { }

  canActivate(): boolean {
    if (storedAuthTokenIsValid()) {
      return true;
    }
      
    this.router.navigate(['/']);
    return false; 
  }
}
