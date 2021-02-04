import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { TestComponent as AdminTestComponent} from './admin/test/test.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminComponent } from './admin/admin/admin.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileComponent } from './profile/profile.component';
import { EditFinalUserComponent } from './admin/edit-final-user/edit-final-user.component';
import { FinalUserComponent } from './admin/final-user/final-user.component';
import { ReportComponent } from './admin/report/report.component';
import { SystemUserComponent } from './admin/system-user/system-user.component';
import { EditSystemUserComponent } from './admin/edit-system-user/edit-system-user.component';
import { EditClientComponent } from './admin/edit-client/edit-client.component';

import { AuthGuardService } from '../app/services/auth/auth-guard.service';

const appRoutes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'test/:id', component: TestComponent, canActivate: [AuthGuardService]},
  { path: 'recovery', component: RecoveryComponent },
  { path: 'registry', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'app', component: NavigationComponent,
    children:[
      { path: 'admin', component: FinalUserComponent, pathMatch: "full" },
      { path: 'test', component: AdminTestComponent },
      { path: 'home', component: HomeComponent},
      { path: 'report', component: ReportComponent },
      { path: 'edit-final-user', component: EditFinalUserComponent },
      { path: 'create-client', component: AdminComponent },
      { path: 'system-user', component: SystemUserComponent },
      { path: 'edit-system-user', component: EditSystemUserComponent },
      { path: 'edit-client', component: EditClientComponent },
    ],
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
