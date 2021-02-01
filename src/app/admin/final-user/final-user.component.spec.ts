import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalUserComponent } from './final-user.component';

describe('FinalUserComponent', () => {
  let component: FinalUserComponent;
  let fixture: ComponentFixture<FinalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
