import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosCostos } from './gastos-costos';

describe('GastosCostos', () => {
  let component: GastosCostos;
  let fixture: ComponentFixture<GastosCostos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosCostos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosCostos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
