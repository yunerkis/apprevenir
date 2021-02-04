import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, FormArray  } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

interface User {
  name: string;
  id: number;
}

interface Data {
  users: User[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {

  clientForm: FormGroup;
  selectable = true;
  removable = true;
  countries = [];
  states = [];
  cities = [];
  data: Data = {
    users: [
    {name: 'User1', id: 0},
    {name: 'User2', id: 1},
    {name: 'User3', id: 2},
  ]};

  remove(getId: number): void {
    this.data.users = [...this.data.users.filter(({id}) => getId !== id)];
  }

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.clientForm = this.formBuilder.group({
      client: ['', Validators.required],
      first_names: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
    }); 

    this.getCountries();
  }

  getCountries() {

    this.userService.countries().subscribe( res => {
        this.countries = res['data'];
      });
  }

  getStates(country) {
    
    if (country != '') {
      this.userService.states(country).subscribe( res => {
         this.states = res['data'];
        });
    } else {
      this.states = [];
      this.getCities('');
    }
  }

  getCities(state) {

    if (state != '') {
      this.userService.cities(state).subscribe( res => {
         this.cities = res['data'];
        });
    } else {
      this.cities = [];
    }
  }

  onSubmit() {

    if(this.clientForm.invalid) {
      return;
    }

    let formData = Object.assign(this.clientForm.value);

    formData.last_names = 'cliente';

    this.userService.client(formData);
  }
}
