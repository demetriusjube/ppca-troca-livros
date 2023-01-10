import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemDesejado } from '../item-desejado.model';
import { ItemDesejadoService } from '../service/item-desejado.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './item-desejado-delete-dialog.component.html',
})
export class ItemDesejadoDeleteDialogComponent {
  itemDesejado?: IItemDesejado;

  constructor(protected itemDesejadoService: ItemDesejadoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemDesejadoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
