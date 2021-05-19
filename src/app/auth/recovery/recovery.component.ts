import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {
  
  emailForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder, 
  ) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }

  onSubmit() {
    if(this.emailForm.invalid) {
      return;
    }

    this.authService.recovery(this.emailForm.value);
  }

}
