import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { 
  PASSWORD_CONFIRMATION_KEY, 
  PASSWORD_KEY,
  passwordConfirmationValidator 
} from '@services/forms/passwordValidators';


@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      [PASSWORD_KEY]: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])],
      [PASSWORD_CONFIRMATION_KEY] : ['', Validators.compose([Validators.required])]
    }, {
      validators: [ 
      passwordConfirmationValidator
    ]});
  }

  onSubmit() {
    if(this.passwordForm.invalid) {
      return;
    }
   
    let password = {
      'password': this.passwordForm.value.password,
      'password_confirmation': this.passwordForm.value.passwordConfirmation,
      'token': window.location.href.split('/')[4],
    }
    
    this.authService.recoveryPassword(password);
  }

}
