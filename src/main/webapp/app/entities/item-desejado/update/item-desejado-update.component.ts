import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemDesejadoFormService, ItemDesejadoFormGroup } from './item-desejado-form.service';
import { IItemDesejado } from '../item-desejado.model';
import { ItemDesejadoService } from '../service/item-desejado.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { SituacaoItem } from 'app/entities/enumerations/situacao-item.model';

@Component({
  selector: 'jhi-item-desejado-update',
  templateUrl: './item-desejado-update.component.html',
})
export class ItemDesejadoUpdateComponent implements OnInit {
  isSaving = false;
  itemDesejado: IItemDesejado | null = null;
  situacaoItemValues = Object.keys(SituacaoItem);

  usersSharedCollection: IUser[] = [];

  editForm: ItemDesejadoFormGroup = this.itemDesejadoFormService.createItemDesejadoFormGroup();

  constructor(
    protected itemDesejadoService: ItemDesejadoService,
    protected itemDesejadoFormService: ItemDesejadoFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemDesejado }) => {
      this.itemDesejado = itemDesejado;
      if (itemDesejado) {
        this.updateForm(itemDesejado);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemDesejado = this.itemDesejadoFormService.getItemDesejado(this.editForm);
    if (itemDesejado.id !== null) {
      this.subscribeToSaveResponse(this.itemDesejadoService.update(itemDesejado));
    } else {
      this.subscribeToSaveResponse(this.itemDesejadoService.create(itemDesejado));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemDesejado>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(itemDesejado: IItemDesejado): void {
    this.itemDesejado = itemDesejado;
    this.itemDesejadoFormService.resetForm(this.editForm, itemDesejado);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, itemDesejado.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.itemDesejado?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
