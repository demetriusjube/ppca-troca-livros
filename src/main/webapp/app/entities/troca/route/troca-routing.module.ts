import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrocaComponent } from '../list/troca.component';
import { TrocaDetailComponent } from '../detail/troca-detail.component';
import { TrocaUpdateComponent } from '../update/troca-update.component';
import { TrocaRoutingResolveService } from './troca-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const trocaRoute: Routes = [
  {
    path: '',
    component: TrocaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrocaDetailComponent,
    resolve: {
      troca: TrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrocaUpdateComponent,
    resolve: {
      troca: TrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrocaUpdateComponent,
    resolve: {
      troca: TrocaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trocaRoute)],
  exports: [RouterModule],
})
export class TrocaRoutingModule {}
