import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstanteUsuarioComponent } from './estante-usuario.component';

describe('EstanteUsuarioComponent', () => {
  let component: EstanteUsuarioComponent;
  let fixture: ComponentFixture<EstanteUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstanteUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstanteUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
