import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemTroca, NewItemTroca } from '../item-troca.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemTroca for edit and NewItemTrocaFormGroupInput for create.
 */
type ItemTrocaFormGroupInput = IItemTroca | PartialWithRequiredKeyOf<NewItemTroca>;

type ItemTrocaFormDefaults = Pick<NewItemTroca, 'id'>;

type ItemTrocaFormGroupContent = {
  id: FormControl<IItemTroca['id'] | NewItemTroca['id']>;
  nome: FormControl<IItemTroca['nome']>;
  idGlobal: FormControl<IItemTroca['idGlobal']>;
  situacao: FormControl<IItemTroca['situacao']>;
  user: FormControl<IItemTroca['user']>;
  troca: FormControl<IItemTroca['troca']>;
};

export type ItemTrocaFormGroup = FormGroup<ItemTrocaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemTrocaFormService {
  createItemTrocaFormGroup(itemTroca: ItemTrocaFormGroupInput = { id: null }): ItemTrocaFormGroup {
    const itemTrocaRawValue = {
      ...this.getFormDefaults(),
      ...itemTroca,
    };
    return new FormGroup<ItemTrocaFormGroupContent>({
      id: new FormControl(
        { value: itemTrocaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nome: new FormControl(itemTrocaRawValue.nome),
      idGlobal: new FormControl(itemTrocaRawValue.idGlobal),
      situacao: new FormControl(itemTrocaRawValue.situacao),
      user: new FormControl(itemTrocaRawValue.user),
      troca: new FormControl(itemTrocaRawValue.troca),
    });
  }

  getItemTroca(form: ItemTrocaFormGroup): IItemTroca | NewItemTroca {
    return form.getRawValue() as IItemTroca | NewItemTroca;
  }

  resetForm(form: ItemTrocaFormGroup, itemTroca: ItemTrocaFormGroupInput): void {
    const itemTrocaRawValue = { ...this.getFormDefaults(), ...itemTroca };
    form.reset(
      {
        ...itemTrocaRawValue,
        id: { value: itemTrocaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemTrocaFormDefaults {
    return {
      id: null,
    };
  }
}
