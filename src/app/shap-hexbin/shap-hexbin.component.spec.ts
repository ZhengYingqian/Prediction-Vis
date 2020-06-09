import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapHexbinComponent } from './shap-hexbin.component';

describe('ShapHexbinComponent', () => {
  let component: ShapHexbinComponent;
  let fixture: ComponentFixture<ShapHexbinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapHexbinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapHexbinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
