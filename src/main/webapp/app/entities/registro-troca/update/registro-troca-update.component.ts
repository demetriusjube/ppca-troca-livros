import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RegistroTrocaFormService, RegistroTrocaFormGroup } from './registro-troca-form.service';
import { IRegistroTroca } from '../registro-troca.model';
import { RegistroTrocaService } from '../service/registro-troca.service';
import { IItemTroca } from 'app/entities/item-troca/item-troca.model';
import { ItemTrocaService } from 'app/entities/item-troca/service/item-troca.service';
import { ITroca } from 'app/entities/troca/troca.model';
import { TrocaService } from 'app/entities/troca/service/troca.service';

@Component({
  selector: 'jhi-registro-troca-update',
  templateUrl: './registro-troca-update.component.html',
})
export class RegistroTrocaUpdateComponent implements OnInit {
  isSaving = false;
  registroTroca: IRegistroTroca | null = null;

  itemTrocasSharedCollection: IItemTroca[] = [];
  trocasSharedCollection: ITroca[] = [];

  editForm: RegistroTrocaFormGroup = this.registroTrocaFormService.createRegistroTrocaFormGroup();

  constructor(
    protected registroTrocaService: RegistroTrocaService,
    protected registroTrocaFormService: RegistroTrocaFormService,
    protected itemTrocaService: ItemTrocaService,
    protected trocaService: TrocaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareItemTroca = (o1: IItemTroca | null, o2: IItemTroca | null): boolean => this.itemTrocaService.compareItemTroca(o1, o2);

  compareTroca = (o1: ITroca | null, o2: ITroca | null): boolean => this.trocaService.compareTroca(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroTroca }) => {
      this.registroTroca = registroTroca;
      if (registroTroca) {
        this.updateForm(registroTroca);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const registroTroca = this.registroTrocaFormService.getRegistroTroca(this.editForm);
    if (registroTroca.id !== null) {
      this.subscribeToSaveResponse(this.registroTrocaService.update(registroTroca));
    } else {
      this.subscribeToSaveResponse(this.registroTrocaService.create(registroTroca));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegistroTroca>>): void {
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

  protected updateForm(registroTroca: IRegistroTroca): void {
    this.registroTroca = registroTroca;
    this.registroTrocaFormService.resetForm(this.editForm, registroTroca);

    this.itemTrocasSharedCollection = this.itemTrocaService.addItemTrocaToCollectionIfMissing<IItemTroca>(
      this.itemTrocasSharedCollection,
      registroTroca.origem,
      registroTroca.destino
    );
    this.trocasSharedCollection = this.trocaService.addTrocaToCollectionIfMissing<ITroca>(this.trocasSharedCollection, registroTroca.troca);
  }

  protected loadRelationshipsOptions(): void {
    this.itemTrocaService
      .query()
      .pipe(map((res: HttpResponse<IItemTroca[]>) => res.body ?? []))
      .pipe(
        map((itemTrocas: IItemTroca[]) =>
          this.itemTrocaService.addItemTrocaToCollectionIfMissing<IItemTroca>(
            itemTrocas,
            this.registroTroca?.origem,
            this.registroTroca?.destino
          )
        )
      )
      .subscribe((itemTrocas: IItemTroca[]) => (this.itemTrocasSharedCollection = itemTrocas));

    this.trocaService
      .query()
      .pipe(map((res: HttpResponse<ITroca[]>) => res.body ?? []))
      .pipe(map((trocas: ITroca[]) => this.trocaService.addTrocaToCollectionIfMissing<ITroca>(trocas, this.registroTroca?.troca)))
      .subscribe((trocas: ITroca[]) => (this.trocasSharedCollection = trocas));
  }
}
