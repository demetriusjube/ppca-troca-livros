import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RegistroTrocaComponent } from './list/registro-troca.component';
import { RegistroTrocaDetailComponent } from './detail/registro-troca-detail.component';
import { RegistroTrocaUpdateComponent } from './update/registro-troca-update.component';
import { RegistroTrocaDeleteDialogComponent } from './delete/registro-troca-delete-dialog.component';
import { RegistroTrocaRoutingModule } from './route/registro-troca-routing.module';

@NgModule({
  imports: [SharedModule, RegistroTrocaRoutingModule],
  declarations: [RegistroTrocaComponent, RegistroTrocaDetailComponent, RegistroTrocaUpdateComponent, RegistroTrocaDeleteDialogComponent],
})
export class RegistroTrocaModule {}
