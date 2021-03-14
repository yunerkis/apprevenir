import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { PolicyModalComponent } from '../policy-modal/policy-modal.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  show = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private formBuilder: FormBuilder,  
  ) { }

  openDialog() {

    const dialogRef = this.dialog.open(ModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogPolicy() {

    const dialogRef = this.dialog.open(PolicyModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      remember_me: [''],
    });
  }

  onSubmit() {

    if(this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value);
  }

  password() {
    this.show = !this.show;
  }
}
