import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
  {position: "Tecnologías", name: '08/09/20', weight: "--", symbol: '--'},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}