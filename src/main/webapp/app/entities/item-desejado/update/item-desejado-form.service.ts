import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemDesejado, NewItemDesejado } from '../item-desejado.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemDesejado for edit and NewItemDesejadoFormGroupInput for create.
 */
type ItemDesejadoFormGroupInput = IItemDesejado | PartialWithRequiredKeyOf<NewItemDesejado>;

type ItemDesejadoFormDefaults = Pick<NewItemDesejado, 'id'>;

type ItemDesejadoFormGroupContent = {
  id: FormControl<IItemDesejado['id'] | NewItemDesejado['id']>;
  nome: FormControl<IItemDesejado['nome']>;
  idGlobal: FormControl<IItemDesejado['idGlobal']>;
  situacao: FormControl<IItemDesejado['situacao']>;
  user: FormControl<IItemDesejado['user']>;
};

export type ItemDesejadoFormGroup = FormGroup<ItemDesejadoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemDesejadoFormService {
  createItemDesejadoFormGroup(itemDesejado: ItemDesejadoFormGroupInput = { id: null }): ItemDesejadoFormGroup {
    const itemDesejadoRawValue = {
      ...this.getFormDefaults(),
      ...itemDesejado,
    };
    return new FormGroup<ItemDesejadoFormGroupContent>({
      id: new FormControl(
        { value: itemDesejadoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nome: new FormControl(itemDesejadoRawValue.nome),
      idGlobal: new FormControl(itemDesejadoRawValue.idGlobal),
      situacao: new FormControl(itemDesejadoRawValue.situacao),
      user: new FormControl(itemDesejadoRawValue.user),
    });
  }

  getItemDesejado(form: ItemDesejadoFormGroup): IItemDesejado | NewItemDesejado {
    return form.getRawValue() as IItemDesejado | NewItemDesejado;
  }

  resetForm(form: ItemDesejadoFormGroup, itemDesejado: ItemDesejadoFormGroupInput): void {
    const itemDesejadoRawValue = { ...this.getFormDefaults(), ...itemDesejado };
    form.reset(
      {
        ...itemDesejadoRawValue,
        id: { value: itemDesejadoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemDesejadoFormDefaults {
    return {
      id: null,
    };
  }
}
