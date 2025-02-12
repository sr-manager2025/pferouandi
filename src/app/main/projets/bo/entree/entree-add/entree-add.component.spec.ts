import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntreeAddComponent } from './entree-add.component';

describe('EntreeAddComponent', () => {
  let component: EntreeAddComponent;
  let fixture: ComponentFixture<EntreeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntreeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntreeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
