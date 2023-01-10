import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RegistroTrocaFormService } from './registro-troca-form.service';
import { RegistroTrocaService } from '../service/registro-troca.service';
import { IRegistroTroca } from '../registro-troca.model';
import { IItemTroca } from 'app/entities/item-troca/item-troca.model';
import { ItemTrocaService } from 'app/entities/item-troca/service/item-troca.service';
import { ITroca } from 'app/entities/troca/troca.model';
import { TrocaService } from 'app/entities/troca/service/troca.service';

import { RegistroTrocaUpdateComponent } from './registro-troca-update.component';

describe('RegistroTroca Management Update Component', () => {
  let comp: RegistroTrocaUpdateComponent;
  let fixture: ComponentFixture<RegistroTrocaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let registroTrocaFormService: RegistroTrocaFormService;
  let registroTrocaService: RegistroTrocaService;
  let itemTrocaService: ItemTrocaService;
  let trocaService: TrocaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RegistroTrocaUpdateComponent],
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
      .overrideTemplate(RegistroTrocaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistroTrocaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    registroTrocaFormService = TestBed.inject(RegistroTrocaFormService);
    registroTrocaService = TestBed.inject(RegistroTrocaService);
    itemTrocaService = TestBed.inject(ItemTrocaService);
    trocaService = TestBed.inject(TrocaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ItemTroca query and add missing value', () => {
      const registroTroca: IRegistroTroca = { id: 456 };
      const origem: IItemTroca = { id: 79053 };
      registroTroca.origem = origem;
      const destino: IItemTroca = { id: 56290 };
      registroTroca.destino = destino;

      const itemTrocaCollection: IItemTroca[] = [{ id: 70122 }];
      jest.spyOn(itemTrocaService, 'query').mockReturnValue(of(new HttpResponse({ body: itemTrocaCollection })));
      const additionalItemTrocas = [origem, destino];
      const expectedCollection: IItemTroca[] = [...additionalItemTrocas, ...itemTrocaCollection];
      jest.spyOn(itemTrocaService, 'addItemTrocaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registroTroca });
      comp.ngOnInit();

      expect(itemTrocaService.query).toHaveBeenCalled();
      expect(itemTrocaService.addItemTrocaToCollectionIfMissing).toHaveBeenCalledWith(
        itemTrocaCollection,
        ...additionalItemTrocas.map(expect.objectContaining)
      );
      expect(comp.itemTrocasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Troca query and add missing value', () => {
      const registroTroca: IRegistroTroca = { id: 456 };
      const troca: ITroca = { id: 41405 };
      registroTroca.troca = troca;

      const trocaCollection: ITroca[] = [{ id: 79924 }];
      jest.spyOn(trocaService, 'query').mockReturnValue(of(new HttpResponse({ body: trocaCollection })));
      const additionalTrocas = [troca];
      const expectedCollection: ITroca[] = [...additionalTrocas, ...trocaCollection];
      jest.spyOn(trocaService, 'addTrocaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registroTroca });
      comp.ngOnInit();

      expect(trocaService.query).toHaveBeenCalled();
      expect(trocaService.addTrocaToCollectionIfMissing).toHaveBeenCalledWith(
        trocaCollection,
        ...additionalTrocas.map(expect.objectContaining)
      );
      expect(comp.trocasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const registroTroca: IRegistroTroca = { id: 456 };
      const origem: IItemTroca = { id: 10893 };
      registroTroca.origem = origem;
      const destino: IItemTroca = { id: 45127 };
      registroTroca.destino = destino;
      const troca: ITroca = { id: 76007 };
      registroTroca.troca = troca;

      activatedRoute.data = of({ registroTroca });
      comp.ngOnInit();

      expect(comp.itemTrocasSharedCollection).toContain(origem);
      expect(comp.itemTrocasSharedCollection).toContain(destino);
      expect(comp.trocasSharedCollection).toContain(troca);
      expect(comp.registroTroca).toEqual(registroTroca);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegistroTroca>>();
      const registroTroca = { id: 123 };
      jest.spyOn(registroTrocaFormService, 'getRegistroTroca').mockReturnValue(registroTroca);
      jest.spyOn(registroTrocaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroTroca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registroTroca }));
      saveSubject.complete();

      // THEN
      expect(registroTrocaFormService.getRegistroTroca).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(registroTrocaService.update).toHaveBeenCalledWith(expect.objectContaining(registroTroca));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegistroTroca>>();
      const registroTroca = { id: 123 };
      jest.spyOn(registroTrocaFormService, 'getRegistroTroca').mockReturnValue({ id: null });
      jest.spyOn(registroTrocaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroTroca: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registroTroca }));
      saveSubject.complete();

      // THEN
      expect(registroTrocaFormService.getRegistroTroca).toHaveBeenCalled();
      expect(registroTrocaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRegistroTroca>>();
      const registroTroca = { id: 123 };
      jest.spyOn(registroTrocaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroTroca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(registroTrocaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareItemTroca', () => {
      it('Should forward to itemTrocaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itemTrocaService, 'compareItemTroca');
        comp.compareItemTroca(entity, entity2);
        expect(itemTrocaService.compareItemTroca).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTroca', () => {
      it('Should forward to trocaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(trocaService, 'compareTroca');
        comp.compareTroca(entity, entity2);
        expect(trocaService.compareTroca).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
