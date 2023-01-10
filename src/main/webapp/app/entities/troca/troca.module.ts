import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrocaComponent } from './list/troca.component';
import { TrocaDetailComponent } from './detail/troca-detail.component';
import { TrocaUpdateComponent } from './update/troca-update.component';
import { TrocaDeleteDialogComponent } from './delete/troca-delete-dialog.component';
import { TrocaRoutingModule } from './route/troca-routing.module';

@NgModule({
  imports: [SharedModule, TrocaRoutingModule],
  declarations: [TrocaComponent, TrocaDetailComponent, TrocaUpdateComponent, TrocaDeleteDialogComponent],
})
export class TrocaModule {}
