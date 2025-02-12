import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CautionAddComponent } from './caution-add.component';

describe('CautionAddComponent', () => {
  let component: CautionAddComponent;
  let fixture: ComponentFixture<CautionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CautionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CautionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
