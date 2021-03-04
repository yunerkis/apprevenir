import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "Tecnologías", name: '08/09/20', weight: "MODERADO", symbol: '--'},
];
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
  
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  openDialogProfile() {
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      id: "modal-width"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}