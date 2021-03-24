import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TestService } from '../../services/test/test.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportModalComponent } from './report-modal/report-modal.component';
import { ExportFormat, ExportType, generateExport } from '@services/exports/exportsDataSource';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit {
  
  color = {
    'Severo': '#FF4E60',
    'Moderado': '#FFA14E',
    'Leve': '#20E57E',
    'Ausencia de Ansiedad': '#20E57E',
    'Ausencia de depresión': '#20E57E',
    'Presencia de Ansiedad': '#FF4E60',
    'Presencia de depresión': '#FF4E60',
  };

  public resultsLength = 0;
  public displayedColumns: string[] = [
    'idUser', 
    'id', 
    'test', 
    'date', 
    'time', 
    'user', 
    'city',
    'level',
    'phone',
    'email',
    'answer',
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>([]);

  constructor (
    public dialog: MatDialog,
    private testService: TestService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    
    this.testService.getAllResutls().subscribe(res => {

      this.dataSource = new MatTableDataSource(res['data']);

      this.dataSource.paginator = this.paginator;
    });

    
  }

  openDialogTestModalReport(test) {
    
    const dialogRef = this.dialog.open(ReportModalComponent, {
      id: "modal-width",
      data: test
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setStyle(color) {
    return {
      'background-color': this.color[color],
      'color': '#fff',
      'padding-left': '15px',
      'padding-right': '15px',
      'border-radius': '10px',
      'padding-top': '1px',
      'padding-bottom': '1px',
    }
  }

  onExcelExportRequested() {
    generateExport(ExportType.TestResults, ExportFormat.Excel);
  }

  onPDFExportRequested() {
    generateExport(ExportType.TestResults, ExportFormat.PDF);
  }
}

export interface PeriodicElement {
  idUser: number;
  id: number;
  test: string;
  date: string;
  time: string;
  user: string;
  city: string;
  level: string;
  phone: string;
  email: string;
  answer: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { idUser: 1, 
    id: 2, 
    test: 'Tecnologías', 
    date: '08/09/20', 
    time: '10:44:15', 
    user: 'Yunerkis Leal',
    city: 'Medellin',
    level: 'Moderado',
    phone: '123456',
    email: 'test@test.com',
    answer: 'icono'
  }
];