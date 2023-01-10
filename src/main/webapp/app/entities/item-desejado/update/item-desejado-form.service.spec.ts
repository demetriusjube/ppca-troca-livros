import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-desejado.test-samples';

import { ItemDesejadoFormService } from './item-desejado-form.service';

describe('ItemDesejado Form Service', () => {
  let service: ItemDesejadoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDesejadoFormService);
  });

  describe('Service methods', () => {
    describe('createItemDesejadoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemDesejadoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            idGlobal: expect.any(Object),
            situacao: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IItemDesejado should create a new form with FormGroup', () => {
        const formGroup = service.createItemDesejadoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            idGlobal: expect.any(Object),
            situacao: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getItemDesejado', () => {
      it('should return NewItemDesejado for default ItemDesejado initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemDesejadoFormGroup(sampleWithNewData);

        const itemDesejado = service.getItemDesejado(formGroup) as any;

        expect(itemDesejado).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemDesejado for empty ItemDesejado initial value', () => {
        const formGroup = service.createItemDesejadoFormGroup();

        const itemDesejado = service.getItemDesejado(formGroup) as any;

        expect(itemDesejado).toMatchObject({});
      });

      it('should return IItemDesejado', () => {
        const formGroup = service.createItemDesejadoFormGroup(sampleWithRequiredData);

        const itemDesejado = service.getItemDesejado(formGroup) as any;

        expect(itemDesejado).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemDesejado should not enable id FormControl', () => {
        const formGroup = service.createItemDesejadoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemDesejado should disable id FormControl', () => {
        const formGroup = service.createItemDesejadoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
