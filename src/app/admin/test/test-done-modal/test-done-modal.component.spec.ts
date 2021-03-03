import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDoneModalComponent } from './test-done-modal.component';

describe('TestDoneModalComponent', () => {
  let component: TestDoneModalComponent;
  let fixture: ComponentFixture<TestDoneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDoneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
