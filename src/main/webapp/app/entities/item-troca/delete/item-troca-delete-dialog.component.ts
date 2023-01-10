import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemTroca } from '../item-troca.model';
import { ItemTrocaService } from '../service/item-troca.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './item-troca-delete-dialog.component.html',
})
export class ItemTrocaDeleteDialogComponent {
  itemTroca?: IItemTroca;

  constructor(protected itemTrocaService: ItemTrocaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemTrocaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
