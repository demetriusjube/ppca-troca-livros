import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITroca, NewTroca } from '../troca.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITroca for edit and NewTrocaFormGroupInput for create.
 */
type TrocaFormGroupInput = ITroca | PartialWithRequiredKeyOf<NewTroca>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITroca | NewTroca> = Omit<T, 'dataInicio' | 'dataFim'> & {
  dataInicio?: string | null;
  dataFim?: string | null;
};

type TrocaFormRawValue = FormValueOf<ITroca>;

type NewTrocaFormRawValue = FormValueOf<NewTroca>;

type TrocaFormDefaults = Pick<NewTroca, 'id' | 'dataInicio' | 'dataFim'>;

type TrocaFormGroupContent = {
  id: FormControl<TrocaFormRawValue['id'] | NewTroca['id']>;
  dataInicio: FormControl<TrocaFormRawValue['dataInicio']>;
  dataFim: FormControl<TrocaFormRawValue['dataFim']>;
  resultado: FormControl<TrocaFormRawValue['resultado']>;
};

export type TrocaFormGroup = FormGroup<TrocaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TrocaFormService {
  createTrocaFormGroup(troca: TrocaFormGroupInput = { id: null }): TrocaFormGroup {
    const trocaRawValue = this.convertTrocaToTrocaRawValue({
      ...this.getFormDefaults(),
      ...troca,
    });
    return new FormGroup<TrocaFormGroupContent>({
      id: new FormControl(
        { value: trocaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dataInicio: new FormControl(trocaRawValue.dataInicio),
      dataFim: new FormControl(trocaRawValue.dataFim),
      resultado: new FormControl(trocaRawValue.resultado),
    });
  }

  getTroca(form: TrocaFormGroup): ITroca | NewTroca {
    return this.convertTrocaRawValueToTroca(form.getRawValue() as TrocaFormRawValue | NewTrocaFormRawValue);
  }

  resetForm(form: TrocaFormGroup, troca: TrocaFormGroupInput): void {
    const trocaRawValue = this.convertTrocaToTrocaRawValue({ ...this.getFormDefaults(), ...troca });
    form.reset(
      {
        ...trocaRawValue,
        id: { value: trocaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TrocaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataInicio: currentTime,
      dataFim: currentTime,
    };
  }

  private convertTrocaRawValueToTroca(rawTroca: TrocaFormRawValue | NewTrocaFormRawValue): ITroca | NewTroca {
    return {
      ...rawTroca,
      dataInicio: dayjs(rawTroca.dataInicio, DATE_TIME_FORMAT),
      dataFim: dayjs(rawTroca.dataFim, DATE_TIME_FORMAT),
    };
  }

  private convertTrocaToTrocaRawValue(
    troca: ITroca | (Partial<NewTroca> & TrocaFormDefaults)
  ): TrocaFormRawValue | PartialWithRequiredKeyOf<NewTrocaFormRawValue> {
    return {
      ...troca,
      dataInicio: troca.dataInicio ? troca.dataInicio.format(DATE_TIME_FORMAT) : undefined,
      dataFim: troca.dataFim ? troca.dataFim.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
