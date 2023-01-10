import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRegistroTroca, NewRegistroTroca } from '../registro-troca.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRegistroTroca for edit and NewRegistroTrocaFormGroupInput for create.
 */
type RegistroTrocaFormGroupInput = IRegistroTroca | PartialWithRequiredKeyOf<NewRegistroTroca>;

type RegistroTrocaFormDefaults = Pick<NewRegistroTroca, 'id' | 'aceite'>;

type RegistroTrocaFormGroupContent = {
  id: FormControl<IRegistroTroca['id'] | NewRegistroTroca['id']>;
  aceite: FormControl<IRegistroTroca['aceite']>;
  origem: FormControl<IRegistroTroca['origem']>;
  destino: FormControl<IRegistroTroca['destino']>;
  troca: FormControl<IRegistroTroca['troca']>;
};

export type RegistroTrocaFormGroup = FormGroup<RegistroTrocaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RegistroTrocaFormService {
  createRegistroTrocaFormGroup(registroTroca: RegistroTrocaFormGroupInput = { id: null }): RegistroTrocaFormGroup {
    const registroTrocaRawValue = {
      ...this.getFormDefaults(),
      ...registroTroca,
    };
    return new FormGroup<RegistroTrocaFormGroupContent>({
      id: new FormControl(
        { value: registroTrocaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      aceite: new FormControl(registroTrocaRawValue.aceite),
      origem: new FormControl(registroTrocaRawValue.origem),
      destino: new FormControl(registroTrocaRawValue.destino),
      troca: new FormControl(registroTrocaRawValue.troca),
    });
  }

  getRegistroTroca(form: RegistroTrocaFormGroup): IRegistroTroca | NewRegistroTroca {
    return form.getRawValue() as IRegistroTroca | NewRegistroTroca;
  }

  resetForm(form: RegistroTrocaFormGroup, registroTroca: RegistroTrocaFormGroupInput): void {
    const registroTrocaRawValue = { ...this.getFormDefaults(), ...registroTroca };
    form.reset(
      {
        ...registroTrocaRawValue,
        id: { value: registroTrocaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RegistroTrocaFormDefaults {
    return {
      id: null,
      aceite: false,
    };
  }
}
