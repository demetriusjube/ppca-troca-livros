import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemTrocaComponent } from './list/item-troca.component';
import { ItemTrocaDetailComponent } from './detail/item-troca-detail.component';
import { ItemTrocaUpdateComponent } from './update/item-troca-update.component';
import { ItemTrocaDeleteDialogComponent } from './delete/item-troca-delete-dialog.component';
import { ItemTrocaRoutingModule } from './route/item-troca-routing.module';

@NgModule({
  imports: [SharedModule, ItemTrocaRoutingModule],
  declarations: [ItemTrocaComponent, ItemTrocaDetailComponent, ItemTrocaUpdateComponent, ItemTrocaDeleteDialogComponent],
})
export class ItemTrocaModule {}
