import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { getStoredProfileInfo } from "./authStore";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(
    private router : Router,
  ) { }

  canActivate(): boolean {
    if (getStoredProfileInfo().isAdmin) {
      return true;
    }
      
    return false; 
  }
}
