import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TrocaFormService, TrocaFormGroup } from './troca-form.service';
import { ITroca } from '../troca.model';
import { TrocaService } from '../service/troca.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-troca-update',
  templateUrl: './troca-update.component.html',
})
export class TrocaUpdateComponent implements OnInit {
  isSaving = false;
  troca: ITroca | null = null;

  editForm: TrocaFormGroup = this.trocaFormService.createTrocaFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected trocaService: TrocaService,
    protected trocaFormService: TrocaFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ troca }) => {
      this.troca = troca;
      if (troca) {
        this.updateForm(troca);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('trocalivrosApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const troca = this.trocaFormService.getTroca(this.editForm);
    if (troca.id !== null) {
      this.subscribeToSaveResponse(this.trocaService.update(troca));
    } else {
      this.subscribeToSaveResponse(this.trocaService.create(troca));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITroca>>): void {
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

  protected updateForm(troca: ITroca): void {
    this.troca = troca;
    this.trocaFormService.resetForm(this.editForm, troca);
  }
}
