import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-troca.test-samples';

import { ItemTrocaFormService } from './item-troca-form.service';

describe('ItemTroca Form Service', () => {
  let service: ItemTrocaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemTrocaFormService);
  });

  describe('Service methods', () => {
    describe('createItemTrocaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemTrocaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            idGlobal: expect.any(Object),
            situacao: expect.any(Object),
            user: expect.any(Object),
            troca: expect.any(Object),
          })
        );
      });

      it('passing IItemTroca should create a new form with FormGroup', () => {
        const formGroup = service.createItemTrocaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            idGlobal: expect.any(Object),
            situacao: expect.any(Object),
            user: expect.any(Object),
            troca: expect.any(Object),
          })
        );
      });
    });

    describe('getItemTroca', () => {
      it('should return NewItemTroca for default ItemTroca initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemTrocaFormGroup(sampleWithNewData);

        const itemTroca = service.getItemTroca(formGroup) as any;

        expect(itemTroca).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemTroca for empty ItemTroca initial value', () => {
        const formGroup = service.createItemTrocaFormGroup();

        const itemTroca = service.getItemTroca(formGroup) as any;

        expect(itemTroca).toMatchObject({});
      });

      it('should return IItemTroca', () => {
        const formGroup = service.createItemTrocaFormGroup(sampleWithRequiredData);

        const itemTroca = service.getItemTroca(formGroup) as any;

        expect(itemTroca).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemTroca should not enable id FormControl', () => {
        const formGroup = service.createItemTrocaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemTroca should disable id FormControl', () => {
        const formGroup = service.createItemTrocaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
