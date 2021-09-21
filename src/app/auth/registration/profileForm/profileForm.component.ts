import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaritalStatusValues } from "../constants/maritalStatusValues";
import { EducationLevels } from '../constants/educationLevels';
import { City, Country, State } from '@typedefs/backend';
import { getCities, getCountries, getStates } from '@services/geoData/geoDataSource';
import { submitRegistrationForms } from '../forms/registrationSubmitHandler';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { loadProfileFormData } from '../forms/profileFormLoader';
import { buildLocationFormGroup, buildLoginFormGroup, buildPersonalInfoFormGroup } from './formSchema';
import { LoaderComponent } from 'src/app/core/loader/loader.component';
import { ClientConfigComponent } from '../clientConfig/client-config.component';
import { showErrorMessage } from '@services/common';

@Component({
  selector: 'profile-form',
  templateUrl: './profileForm.component.html',
  styleUrls: ['./profileForm.component.scss']
})
export class ProfileFormComponent implements OnInit, AfterViewInit {
  @Input("profile-update") profileUpdateModeEnabled: boolean;
  @Input("admin-mode") adminModeEnabled: boolean;
  @Input("user-id-override") userIdOverride: string | null;

  @ViewChild(LoaderComponent) loader: LoaderComponent;
  @ViewChild(ClientConfigComponent) clientConfigurator: ClientConfigComponent;

  personalInfoFormGroup: FormGroup;
  locationFormGroup: FormGroup;
  loginFormGroup: FormGroup;

  maritalStatusValues = MaritalStatusValues;
  educationLevels = EducationLevels;

  countries: Country[] | null = null;
  states: State[] | null = null;
  cities: City[] | null = null;

  constructor(
    private _formBuilder: FormBuilder, private _router: Router,
    private _location: Location
  ) {
    this.onCountryChanged = this.onCountryChanged.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
    this.onSubmitClicked = this.onSubmitClicked.bind(this);
    this.handleRegistrationResult = this.handleRegistrationResult.bind(this);
    this.loadProfileFormDataIfNeeded = this.loadProfileFormDataIfNeeded.bind(this);
  }

  get genderSelectionIsInvalid() {
    if (!this.personalInfoFormGroup) {
      return false;
    }

    const control = this.personalInfoFormGroup.get('gender');
    return control.dirty && control.hasError('required');
  }

  onProfileNextClicked() {
    this.personalInfoFormGroup.get('gender').markAsDirty();
  }

  onCancelClicked() {
    this._location.back();
  }

  async ngOnInit(): Promise<void> {
    this.profileUpdateModeEnabled = !!this.profileUpdateModeEnabled;
    this.adminModeEnabled = !!this.adminModeEnabled;

    this.personalInfoFormGroup = buildPersonalInfoFormGroup(this._formBuilder);
    this.locationFormGroup = buildLocationFormGroup(this._formBuilder);
    this.loginFormGroup = buildLoginFormGroup(this._formBuilder, this.profileUpdateModeEnabled);
  }

  async ngAfterViewInit() {
    await this.loader.showLoadingIndicator(async () => {
      this.countries = await getCountries();
      await this.loadProfileFormDataIfNeeded();
    });
  }

  get passwordChangeRequested() {
    return this.loginFormGroup.get('passwordChangeRequested').value;
  }

  get creationModeEnabled() {
    return !this.adminModeEnabled && !this.profileUpdateModeEnabled && !this.userIdOverride;
  }

  public async onCountryChanged() {
    const selectedCountryId = this.locationFormGroup.get('country').value;
    if (!selectedCountryId) {
      return;
    }

    this.locationFormGroup.get('state').setValue('');
    this.locationFormGroup.get('city').setValue('');
    this.cities = null;

    await this.loader.showLoadingIndicator(async () => {
      this.states = await getStates(selectedCountryId);
    });
  }

  public async onStateChanged() {
    const selectedStateId = this.locationFormGroup.get('state').value;
    if (!selectedStateId) {
      return;
    }

    this.locationFormGroup.get('city').setValue('');

    await this.loader.showLoadingIndicator(async () => {
      this.cities = await getCities(selectedStateId);
    });
  }

  public async onSubmitClicked() {
    const allForms = [
      this.personalInfoFormGroup, 
      this.locationFormGroup, 
      this.loginFormGroup
    ];

    const formsAreValid = allForms.reduce(
      (formsValid, form) => {
        form.markAllAsTouched();
        form.markAsDirty();
        return formsValid && form.valid;
      }, true
    );
    
    if (!formsAreValid) {
      return;
    }
    
    await this.loader.showLoadingIndicator(async () => {
      try {
        const result = await submitRegistrationForms(this.userIdOverride, this.profileUpdateModeEnabled, this.adminModeEnabled, ...allForms);
        this.handleRegistrationResult();
      } catch (error) {
        console.error("Error while trying to submit the registration data", error);
        await showErrorMessage(error);
      }
    });
  }

  async handleRegistrationResult() {
    let successTitle = "Bienvenido";
      let successMessage = "Has sido registrado exitosamente. Utiliza tu correo y contraseña para ingresar.";
      
      if (this.profileUpdateModeEnabled) {
        successTitle = "Perfil Actualizado";
        successMessage = "Tus datos han sido actualizados correctamente";
      }

      if (this.adminModeEnabled) {
        if (this.profileUpdateModeEnabled) {
          successTitle = "Perfil Actualizado";
          successMessage = "Los datos del usuario han sido actualizados";
        } else {
          successTitle = "Usuario creado";
          successMessage = "El usuario ha sido creado correctamente";
        }
      }
      
      await Swal.fire(successTitle, successMessage, "success");

      if (this.profileUpdateModeEnabled) {
        this._location.back();
      } else {
        this._router.navigate(['']); 
      }
      return;
  }

  async loadProfileFormDataIfNeeded() {
    if (!this.profileUpdateModeEnabled) {
      return;
    }

    const currentFormData = await loadProfileFormData(this.userIdOverride);
    this.personalInfoFormGroup.patchValue(currentFormData.personalInfo);
    this.locationFormGroup.patchValue(currentFormData.location);
    this.loginFormGroup.patchValue(currentFormData.login);
    
    await this.clientConfigurator.ingestFormData(currentFormData);

    if (typeof currentFormData.location.country === "number") {
      this.states = await getStates(currentFormData.location.country);
    }

    if (typeof currentFormData.location.state === "number") {
      this.cities = await getCities(currentFormData.location.state);
    }

  }
}
