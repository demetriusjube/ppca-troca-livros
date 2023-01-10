import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../troca.test-samples';

import { TrocaFormService } from './troca-form.service';

describe('Troca Form Service', () => {
  let service: TrocaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrocaFormService);
  });

  describe('Service methods', () => {
    describe('createTrocaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTrocaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataInicio: expect.any(Object),
            dataFim: expect.any(Object),
            resultado: expect.any(Object),
          })
        );
      });

      it('passing ITroca should create a new form with FormGroup', () => {
        const formGroup = service.createTrocaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataInicio: expect.any(Object),
            dataFim: expect.any(Object),
            resultado: expect.any(Object),
          })
        );
      });
    });

    describe('getTroca', () => {
      it('should return NewTroca for default Troca initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTrocaFormGroup(sampleWithNewData);

        const troca = service.getTroca(formGroup) as any;

        expect(troca).toMatchObject(sampleWithNewData);
      });

      it('should return NewTroca for empty Troca initial value', () => {
        const formGroup = service.createTrocaFormGroup();

        const troca = service.getTroca(formGroup) as any;

        expect(troca).toMatchObject({});
      });

      it('should return ITroca', () => {
        const formGroup = service.createTrocaFormGroup(sampleWithRequiredData);

        const troca = service.getTroca(formGroup) as any;

        expect(troca).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITroca should not enable id FormControl', () => {
        const formGroup = service.createTrocaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTroca should disable id FormControl', () => {
        const formGroup = service.createTrocaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
