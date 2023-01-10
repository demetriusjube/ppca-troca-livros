import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemDesejadoComponent } from './list/item-desejado.component';
import { ItemDesejadoDetailComponent } from './detail/item-desejado-detail.component';
import { ItemDesejadoUpdateComponent } from './update/item-desejado-update.component';
import { ItemDesejadoDeleteDialogComponent } from './delete/item-desejado-delete-dialog.component';
import { ItemDesejadoRoutingModule } from './route/item-desejado-routing.module';

@NgModule({
  imports: [SharedModule, ItemDesejadoRoutingModule],
  declarations: [ItemDesejadoComponent, ItemDesejadoDetailComponent, ItemDesejadoUpdateComponent, ItemDesejadoDeleteDialogComponent],
})
export class ItemDesejadoModule {}
