import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../registro-troca.test-samples';

import { RegistroTrocaFormService } from './registro-troca-form.service';

describe('RegistroTroca Form Service', () => {
  let service: RegistroTrocaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroTrocaFormService);
  });

  describe('Service methods', () => {
    describe('createRegistroTrocaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRegistroTrocaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            aceite: expect.any(Object),
            origem: expect.any(Object),
            destino: expect.any(Object),
            troca: expect.any(Object),
          })
        );
      });

      it('passing IRegistroTroca should create a new form with FormGroup', () => {
        const formGroup = service.createRegistroTrocaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            aceite: expect.any(Object),
            origem: expect.any(Object),
            destino: expect.any(Object),
            troca: expect.any(Object),
          })
        );
      });
    });

    describe('getRegistroTroca', () => {
      it('should return NewRegistroTroca for default RegistroTroca initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRegistroTrocaFormGroup(sampleWithNewData);

        const registroTroca = service.getRegistroTroca(formGroup) as any;

        expect(registroTroca).toMatchObject(sampleWithNewData);
      });

      it('should return NewRegistroTroca for empty RegistroTroca initial value', () => {
        const formGroup = service.createRegistroTrocaFormGroup();

        const registroTroca = service.getRegistroTroca(formGroup) as any;

        expect(registroTroca).toMatchObject({});
      });

      it('should return IRegistroTroca', () => {
        const formGroup = service.createRegistroTrocaFormGroup(sampleWithRequiredData);

        const registroTroca = service.getRegistroTroca(formGroup) as any;

        expect(registroTroca).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRegistroTroca should not enable id FormControl', () => {
        const formGroup = service.createRegistroTrocaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRegistroTroca should disable id FormControl', () => {
        const formGroup = service.createRegistroTrocaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
