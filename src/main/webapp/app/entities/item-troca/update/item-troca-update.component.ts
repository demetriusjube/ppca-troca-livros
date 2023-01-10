import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemTrocaFormService, ItemTrocaFormGroup } from './item-troca-form.service';
import { IItemTroca } from '../item-troca.model';
import { ItemTrocaService } from '../service/item-troca.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITroca } from 'app/entities/troca/troca.model';
import { TrocaService } from 'app/entities/troca/service/troca.service';
import { SituacaoItem } from 'app/entities/enumerations/situacao-item.model';

@Component({
  selector: 'jhi-item-troca-update',
  templateUrl: './item-troca-update.component.html',
})
export class ItemTrocaUpdateComponent implements OnInit {
  isSaving = false;
  itemTroca: IItemTroca | null = null;
  situacaoItemValues = Object.keys(SituacaoItem);

  usersSharedCollection: IUser[] = [];
  trocasSharedCollection: ITroca[] = [];

  editForm: ItemTrocaFormGroup = this.itemTrocaFormService.createItemTrocaFormGroup();

  constructor(
    protected itemTrocaService: ItemTrocaService,
    protected itemTrocaFormService: ItemTrocaFormService,
    protected userService: UserService,
    protected trocaService: TrocaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareTroca = (o1: ITroca | null, o2: ITroca | null): boolean => this.trocaService.compareTroca(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemTroca }) => {
      this.itemTroca = itemTroca;
      if (itemTroca) {
        this.updateForm(itemTroca);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemTroca = this.itemTrocaFormService.getItemTroca(this.editForm);
    if (itemTroca.id !== null) {
      this.subscribeToSaveResponse(this.itemTrocaService.update(itemTroca));
    } else {
      this.subscribeToSaveResponse(this.itemTrocaService.create(itemTroca));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemTroca>>): void {
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

  protected updateForm(itemTroca: IItemTroca): void {
    this.itemTroca = itemTroca;
    this.itemTrocaFormService.resetForm(this.editForm, itemTroca);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, itemTroca.user);
    this.trocasSharedCollection = this.trocaService.addTrocaToCollectionIfMissing<ITroca>(this.trocasSharedCollection, itemTroca.troca);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.itemTroca?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.trocaService
      .query()
      .pipe(map((res: HttpResponse<ITroca[]>) => res.body ?? []))
      .pipe(map((trocas: ITroca[]) => this.trocaService.addTrocaToCollectionIfMissing<ITroca>(trocas, this.itemTroca?.troca)))
      .subscribe((trocas: ITroca[]) => (this.trocasSharedCollection = trocas));
  }
}
