import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit {
  
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
    'answer',
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
  answer: string;
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
    level: 'Moderado',
    answer: 'icono'
  }
];