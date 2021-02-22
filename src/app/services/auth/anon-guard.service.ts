import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { storedAuthTokenIsValid } from "./authStore";

@Injectable({
  providedIn: 'root'
})
export class AnonGuardService implements CanActivate {

  constructor(
    private router : Router,
  ) { }

  canActivate(): boolean {
    if (storedAuthTokenIsValid()) {
      this.router.navigate(['/app/home']);
      return false;
    }
      
    return true; 
  }
}
