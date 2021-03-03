import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TestDoneModalComponent } from '../test/test-done-modal/test-done-modal.component'
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements AfterViewInit {
  
  constructor (
    public dialog: MatDialog,
  ) {
    
  }
  public resultsLength = 0;
  public displayedColumns: string[] = [
    'idUser', 
    'id', 
    'type', 
    'test', 
    'date', 
    'time', 
    'user', 
    'city',
    'type_user',
    'level',
    'icon',
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialogTestModal(test) {
    const dialogRef = this.dialog.open(TestDoneModalComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

export interface PeriodicElement {
  idUser: number;
  id: number;
  type: string;
  test: string;
  date: string;
  time: string;
  user: string;
  city: string;
  type_user: string;
  level: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { idUser: 1, 
    id: 2, 
    type: 'Normal', 
    test: 'Tecnologías', 
    date: '08/09/20', 
    time: '10:44:15', 
    user: 'Yunerkis Leal',
    city: 'Medellin',
    type_user: "Consumidor",
    level: 'Moderado'
  }
];