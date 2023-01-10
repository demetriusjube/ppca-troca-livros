import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemTrocaFormService } from './item-troca-form.service';
import { ItemTrocaService } from '../service/item-troca.service';
import { IItemTroca } from '../item-troca.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITroca } from 'app/entities/troca/troca.model';
import { TrocaService } from 'app/entities/troca/service/troca.service';

import { ItemTrocaUpdateComponent } from './item-troca-update.component';

describe('ItemTroca Management Update Component', () => {
  let comp: ItemTrocaUpdateComponent;
  let fixture: ComponentFixture<ItemTrocaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemTrocaFormService: ItemTrocaFormService;
  let itemTrocaService: ItemTrocaService;
  let userService: UserService;
  let trocaService: TrocaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemTrocaUpdateComponent],
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
      .overrideTemplate(ItemTrocaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemTrocaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemTrocaFormService = TestBed.inject(ItemTrocaFormService);
    itemTrocaService = TestBed.inject(ItemTrocaService);
    userService = TestBed.inject(UserService);
    trocaService = TestBed.inject(TrocaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const itemTroca: IItemTroca = { id: 456 };
      const user: IUser = { id: 15906 };
      itemTroca.user = user;

      const userCollection: IUser[] = [{ id: 16314 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemTroca });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Troca query and add missing value', () => {
      const itemTroca: IItemTroca = { id: 456 };
      const troca: ITroca = { id: 10868 };
      itemTroca.troca = troca;

      const trocaCollection: ITroca[] = [{ id: 97864 }];
      jest.spyOn(trocaService, 'query').mockReturnValue(of(new HttpResponse({ body: trocaCollection })));
      const additionalTrocas = [troca];
      const expectedCollection: ITroca[] = [...additionalTrocas, ...trocaCollection];
      jest.spyOn(trocaService, 'addTrocaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemTroca });
      comp.ngOnInit();

      expect(trocaService.query).toHaveBeenCalled();
      expect(trocaService.addTrocaToCollectionIfMissing).toHaveBeenCalledWith(
        trocaCollection,
        ...additionalTrocas.map(expect.objectContaining)
      );
      expect(comp.trocasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemTroca: IItemTroca = { id: 456 };
      const user: IUser = { id: 46082 };
      itemTroca.user = user;
      const troca: ITroca = { id: 7097 };
      itemTroca.troca = troca;

      activatedRoute.data = of({ itemTroca });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.trocasSharedCollection).toContain(troca);
      expect(comp.itemTroca).toEqual(itemTroca);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemTroca>>();
      const itemTroca = { id: 123 };
      jest.spyOn(itemTrocaFormService, 'getItemTroca').mockReturnValue(itemTroca);
      jest.spyOn(itemTrocaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemTroca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemTroca }));
      saveSubject.complete();

      // THEN
      expect(itemTrocaFormService.getItemTroca).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemTrocaService.update).toHaveBeenCalledWith(expect.objectContaining(itemTroca));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemTroca>>();
      const itemTroca = { id: 123 };
      jest.spyOn(itemTrocaFormService, 'getItemTroca').mockReturnValue({ id: null });
      jest.spyOn(itemTrocaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemTroca: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemTroca }));
      saveSubject.complete();

      // THEN
      expect(itemTrocaFormService.getItemTroca).toHaveBeenCalled();
      expect(itemTrocaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemTroca>>();
      const itemTroca = { id: 123 };
      jest.spyOn(itemTrocaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemTroca });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemTrocaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
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
