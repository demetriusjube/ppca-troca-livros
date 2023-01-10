import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemDesejadoFormService } from './item-desejado-form.service';
import { ItemDesejadoService } from '../service/item-desejado.service';
import { IItemDesejado } from '../item-desejado.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ItemDesejadoUpdateComponent } from './item-desejado-update.component';

describe('ItemDesejado Management Update Component', () => {
  let comp: ItemDesejadoUpdateComponent;
  let fixture: ComponentFixture<ItemDesejadoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemDesejadoFormService: ItemDesejadoFormService;
  let itemDesejadoService: ItemDesejadoService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemDesejadoUpdateComponent],
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
      .overrideTemplate(ItemDesejadoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemDesejadoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemDesejadoFormService = TestBed.inject(ItemDesejadoFormService);
    itemDesejadoService = TestBed.inject(ItemDesejadoService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const itemDesejado: IItemDesejado = { id: 456 };
      const user: IUser = { id: 94601 };
      itemDesejado.user = user;

      const userCollection: IUser[] = [{ id: 70279 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemDesejado });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemDesejado: IItemDesejado = { id: 456 };
      const user: IUser = { id: 27555 };
      itemDesejado.user = user;

      activatedRoute.data = of({ itemDesejado });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.itemDesejado).toEqual(itemDesejado);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemDesejado>>();
      const itemDesejado = { id: 123 };
      jest.spyOn(itemDesejadoFormService, 'getItemDesejado').mockReturnValue(itemDesejado);
      jest.spyOn(itemDesejadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemDesejado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemDesejado }));
      saveSubject.complete();

      // THEN
      expect(itemDesejadoFormService.getItemDesejado).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemDesejadoService.update).toHaveBeenCalledWith(expect.objectContaining(itemDesejado));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemDesejado>>();
      const itemDesejado = { id: 123 };
      jest.spyOn(itemDesejadoFormService, 'getItemDesejado').mockReturnValue({ id: null });
      jest.spyOn(itemDesejadoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemDesejado: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemDesejado }));
      saveSubject.complete();

      // THEN
      expect(itemDesejadoFormService.getItemDesejado).toHaveBeenCalled();
      expect(itemDesejadoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemDesejado>>();
      const itemDesejado = { id: 123 };
      jest.spyOn(itemDesejadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemDesejado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemDesejadoService.update).toHaveBeenCalled();
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
  });
});
