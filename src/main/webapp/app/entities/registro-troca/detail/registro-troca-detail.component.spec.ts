import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegistroTrocaDetailComponent } from './registro-troca-detail.component';

describe('RegistroTroca Management Detail Component', () => {
  let comp: RegistroTrocaDetailComponent;
  let fixture: ComponentFixture<RegistroTrocaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroTrocaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ registroTroca: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RegistroTrocaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RegistroTrocaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load registroTroca on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.registroTroca).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
