import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemDesejadoComponent } from '../list/item-desejado.component';
import { ItemDesejadoDetailComponent } from '../detail/item-desejado-detail.component';
import { ItemDesejadoUpdateComponent } from '../update/item-desejado-update.component';
import { ItemDesejadoRoutingResolveService } from './item-desejado-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemDesejadoRoute: Routes = [
  {
    path: '',
    component: ItemDesejadoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemDesejadoDetailComponent,
    resolve: {
      itemDesejado: ItemDesejadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemDesejadoUpdateComponent,
    resolve: {
      itemDesejado: ItemDesejadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemDesejadoUpdateComponent,
    resolve: {
      itemDesejado: ItemDesejadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemDesejadoRoute)],
  exports: [RouterModule],
})
export class ItemDesejadoRoutingModule {}
