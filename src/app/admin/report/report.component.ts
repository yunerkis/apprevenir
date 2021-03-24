import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TestService } from '../../services/test/test.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportModalComponent } from './report-modal/report-modal.component';
import { ExportFormat, ExportType, generateExport } from '@services/exports/exportsDataSource';
import { MatSort } from '@angular/material/sort';
import { TestAssessmentSeverity } from '@typedefs/backend';

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
  public dataSource = new MatTableDataSource<TestResultRow>([]);

  constructor (
    public dialog: MatDialog,
    private testService: TestService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.testService.getAllResutls().subscribe(res => {

      this.dataSource = new MatTableDataSource(res['data']);

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

  getTestChipClass(assessmentLevel: TestAssessmentSeverity): string {
    const chipClassNames: { [key in TestAssessmentSeverity]: string } = {
      [TestAssessmentSeverity.Minor]: "assessmentChipMinor",
      [TestAssessmentSeverity.Moderate]: "assessmentChipModerate",
      [TestAssessmentSeverity.Severe]: "assessmentChipSevere",
      [TestAssessmentSeverity.AbsenceAnxiety]: "assessmentChipAbsenceAnxiety",
      [TestAssessmentSeverity.AbsenceDepression]: "assessmentChipAbsenceDepression",
      [TestAssessmentSeverity.PresenceDepression]: "assessmentChipPresenceDepression",
      [TestAssessmentSeverity.PresenseAnxiety]: "assessmentChipPresenceAnxiety"
    };

    return chipClassNames[assessmentLevel];
  }

  onExcelExportRequested() {
    generateExport(ExportType.TestResults, ExportFormat.Excel);
  }

  onPDFExportRequested() {
    generateExport(ExportType.TestResults, ExportFormat.PDF);
  }
}

export interface TestResultRow {
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
