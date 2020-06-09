import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapVisComponent } from './shap-vis.component';

describe('ShapVisComponent', () => {
  let component: ShapVisComponent;
  let fixture: ComponentFixture<ShapVisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapVisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapVisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
