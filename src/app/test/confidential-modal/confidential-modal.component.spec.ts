import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfidentialModalComponent } from './confidential-modal.component';

describe('ConfidentialModalComponent', () => {
  let component: ConfidentialModalComponent;
  let fixture: ComponentFixture<ConfidentialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfidentialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfidentialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
