import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edit-final-user',
  templateUrl: './edit-final-user.component.html',
  styleUrls: ['./edit-final-user.component.scss']
})
export class EditFinalUserComponent implements AfterViewInit {
  
  public resultsLength = 0;
  public displayedColumns: string[] = [
    'idUser', 
    'name', 
    'type', 
    'test', 
    'date'
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  idUser: string;
  name: string;
  type: string;
  test: string;
  date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { idUser: '001', 
    name: 'Industrias Noel', 
    type: 'Empresa', 
    test: 'Activo', 
    date: 'icon'
  }
];