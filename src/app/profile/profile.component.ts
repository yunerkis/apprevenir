import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getStoredProfileInfo, IProfileInfo, ProfileChangedMessage } from '@services/auth/authStore';
import { EventBus } from '@services/messaging/EventBus';
import { KnownMessageKeys } from '@services/messaging/EventMessage';
import { Subscription } from 'rxjs';
import { TestService } from '../services/test/test.service';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { TestAssessmentSeverity } from '@typedefs/backend';

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
export class ProfileComponent implements OnInit, OnDestroy {
  firstNames = "Nombres";
  lastNames = "Apellidos";
  gender = 0;

  public userIsAdmin = false;

  displayedColumns: string[] = ['Test', 'Fecha', 'Nivel', 'Respuestas'];
  dataSource = [];
  
  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private testService: TestService
  ) { }

  profileSubscription: Subscription | null;

  ngOnInit(): void {
    this.testService.myResults().subscribe(res => {
      this.dataSource = res['data']
    });

    this.updateProfileData(getStoredProfileInfo());
    this.profileSubscription = EventBus.instance.messages<ProfileChangedMessage>(
      KnownMessageKeys.ProfileChanged
    ).subscribe((profileMessage) => {
      this.updateProfileData(profileMessage.payload);
    });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private updateProfileData(profile: IProfileInfo) {
    this.userIsAdmin = profile.isAdmin;
    this.firstNames = profile.firstNames;
    this.lastNames = [profile.lastNames, profile.lastNamesTwo].filter(name => !!name).join(" ");
    this.gender = profile.genderId;
  }
  
  openDialogProfile(test) {
    const dialogRef = this.dialog.open(ProfileModalComponent, {
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
}