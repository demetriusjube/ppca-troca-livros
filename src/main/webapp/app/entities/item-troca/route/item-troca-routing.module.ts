import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemTrocaComponent } from '../list/item-troca.component';
import { ItemTrocaDetailComponent } from '../detail/item-troca-detail.component';
import { ItemTrocaUpdateComponent } from '../update/item-troca-update.component';
import { ItemTrocaRoutingResolveService } from './item-troca-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemTrocaRoute: Routes = [
  {
    path: '',
    component: ItemTrocaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemTrocaDetailComponent,
    resolve: {
      itemTroca: ItemTrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemTrocaUpdateComponent,
    resolve: {
      itemTroca: ItemTrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemTrocaUpdateComponent,
    resolve: {
      itemTroca: ItemTrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemTrocaRoute)],
  exports: [RouterModule],
})
export class ItemTrocaRoutingModule {}
