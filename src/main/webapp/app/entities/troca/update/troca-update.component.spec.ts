import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TrocaFormService } from './troca-form.service';
import { TrocaService } from '../service/troca.service';
import { ITroca } from '../troca.model';

import { TrocaUpdateComponent } from './troca-update.component';

describe('Troca Management Update Component', () => {
  let comp: TrocaUpdateComponent;
  let fixture: ComponentFixture<TrocaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let trocaFormService: TrocaFormService;
  let trocaService: TrocaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TrocaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TrocaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrocaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    trocaFormService = TestBed.inject(TrocaFormService);
    trocaService = TestBed.inject(TrocaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const troca: ITroca = { id: 456 };

      activatedRoute.data = of({ troca });
      comp.ngOnInit();

      expect(comp.troca).toEqual(troca);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITroca>>();
      const troca = { id: 123 };
      jest.spyOn(trocaFormService, 'getTroca').mockReturnValue(troca);
      jest.spyOn(trocaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ troca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: troca }));
      saveSubject.complete();

      // THEN
      expect(trocaFormService.getTroca).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(trocaService.update).toHaveBeenCalledWith(expect.objectContaining(troca));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITroca>>();
      const troca = { id: 123 };
      jest.spyOn(trocaFormService, 'getTroca').mockReturnValue({ id: null });
      jest.spyOn(trocaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ troca: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: troca }));
      saveSubject.complete();

      // THEN
      expect(trocaFormService.getTroca).toHaveBeenCalled();
      expect(trocaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITroca>>();
      const troca = { id: 123 };
      jest.spyOn(trocaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ troca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(trocaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
