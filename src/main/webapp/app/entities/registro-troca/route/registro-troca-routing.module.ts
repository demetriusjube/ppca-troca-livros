import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegistroTrocaComponent } from '../list/registro-troca.component';
import { RegistroTrocaDetailComponent } from '../detail/registro-troca-detail.component';
import { RegistroTrocaUpdateComponent } from '../update/registro-troca-update.component';
import { RegistroTrocaRoutingResolveService } from './registro-troca-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const registroTrocaRoute: Routes = [
  {
    path: '',
    component: RegistroTrocaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegistroTrocaDetailComponent,
    resolve: {
      registroTroca: RegistroTrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegistroTrocaUpdateComponent,
    resolve: {
      registroTroca: RegistroTrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegistroTrocaUpdateComponent,
    resolve: {
      registroTroca: RegistroTrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(registroTrocaRoute)],
  exports: [RouterModule],
})
export class RegistroTrocaRoutingModule {}
