import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistroTroca } from '../registro-troca.model';
import { RegistroTrocaService } from '../service/registro-troca.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './registro-troca-delete-dialog.component.html',
})
export class RegistroTrocaDeleteDialogComponent {
  registroTroca?: IRegistroTroca;

  constructor(protected registroTrocaService: RegistroTrocaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.registroTrocaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
