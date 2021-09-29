import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ReportModalComponent } from './report-modal/report-modal.component';
import { ExportFormat, ExportType, generateExport } from '@services/exports/exportsDataSource';
import { MatSort } from '@angular/material/sort';
import { TestAssessmentSeverity, TestResult } from '@typedefs/backend';
import { getAllTestResults } from '@services/test/testsDataSource';
import { LoaderComponent } from 'src/app/core/loader/loader.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit {
  public resultsLength = 0;
  public displayedColumns: TestResultColumnLabels[] = [
    'userId', 
    'id', 
    'testName', 
    'date', 
    'time', 
    'userName', 
    'city',
    'resultLevel',
    'phone',
    'email',
    'zone',
    'optionA',
    'optionB',
    'university',
    'program',
    'modality',
    'semester',
    'company',
    'location',
    'area',
    'schedul',
    'institution',
    'grade',
    'birthdate',
    'gender',
    'educationalLevel',
    'civilStatus',
    'answers',
  ];
  public dataSource = new MatTableDataSource<TestResultRow>([]);
  civilStatus = {
    1: "Soltero/a",
    2 : "Casado/a",
    3 : "Viudo/a",
    4 : "Divorciado/a"
  };

  educational = {
   1: "Primaria",
   2 : "Bachillerato",
   3: "Universidad",
   4: "Posgrado",
   5: "Ninguno"
  };
  

  constructor (
    public dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.filterTestRows;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(LoaderComponent) loader: LoaderComponent;

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    await this.loader.showLoadingIndicator(async () => {
      const testResults = await getAllTestResults();
      const rows = this.buildTestResultRows(testResults);

      this.dataSource.data = rows;
      this.resultsLength = rows.length;
    });
  }

  buildTestResultRows(testResults: TestResult[]): TestResultRow[] {
    
    return testResults.map(result => ({
      id: result.id,
      city: result.city, // TODO!
      date: result.date,
      time: result.time,
      email: result.user.email,
      birthdate: result.user.profile.birthday,
      gender: result.user.profile.gender_id == 1 ? 'Femenino' : 'Masculino',
      civilStatus: this.civilStatus[result.user.profile.civil_status_id],
      educationalLevel: this.educational[result.user.profile.education_level_id],
      zone: result.zone.casco,
      optionA: result.zone.option_a,
      optionB: result.zone.option_b,
      phone: result.user.profile.phone,
      university: result.university.university,
      program: result.university.program,
      modality: result.university.modality,
      semester: result.university.semester,
      institution: result.institution.institution,
      grade: result.institution.grade,
      company: result.company.company,
      location: result.company.location,
      area: result.company.area,
      schedul: result.company.schedul,
      userId: result.user.id,
      resultLevel: result.resultLevel,
      testName: result.addiction?.['name'] == undefined ? result.testName : result.testName +' - '+result.addiction?.['name'],
      userName: `${result.user.profile.first_names} ${result.user.profile.last_names} ${result.user.profile.last_names_two}`,
      answers: result.answers,
      questions: result.questions
    }));
  }

  openDialogTestModalReport(test: TestResultRow) {
    this.dialog.open(ReportModalComponent, {
      id: "modal-width",
      data: test
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

  filterTestRows(row: TestResultRow, input: string): boolean {
    const filterText = input.toUpperCase();
    return [
      row.id.toString(),
      row.userId.toString(),
      row.userName.toString(),
      row.testName,
      row.city,
      row.resultLevel,
      row.email, 
      row.date,
      row.time,
      row.birthdate,
      row.gender,
      row.civilStatus,
      row.educationalLevel,
      row.zone,
      row.optionA,
      row.optionB,
      row.phone,
      row.university,
      row.program,
      row.modality,
      row.semester,
      row.institution,
      row.grade,
      row.company,
      row.location,
      row.area,
      row.schedul,
    ].some(label => label?.toUpperCase()?.includes(filterText));
  }
}

type TestResultRow = {
  userId: number;
  id: number;
  testName: string;
  date: string;
  time: string;
  userName: string;
  city: string;
  resultLevel: TestAssessmentSeverity;
  phone: string;
  email: string;
  answers: any;
  birthdate: any;
  gender: any;
  civilStatus: any;
  educationalLevel: any;
  zone: any;
  optionA: any;
  optionB: any;
  university: any;
  program: any;
  modality: any;
  semester: any;
  institution: any;
  grade: any;
  company: any;
  location: any;
  area: any;
  schedul: any;
}

type TestResultColumnLabels = keyof TestResultRow | "actions";
