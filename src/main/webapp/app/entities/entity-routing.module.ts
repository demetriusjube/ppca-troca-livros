import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'item-desejado',
        data: { pageTitle: 'trocalivrosApp.itemDesejado.home.title' },
        loadChildren: () => import('./item-desejado/item-desejado.module').then(m => m.ItemDesejadoModule),
      },
      {
        path: 'registro-troca',
        data: { pageTitle: 'trocalivrosApp.registroTroca.home.title' },
        loadChildren: () => import('./registro-troca/registro-troca.module').then(m => m.RegistroTrocaModule),
      },
      {
        path: 'item-troca',
        data: { pageTitle: 'trocalivrosApp.itemTroca.home.title' },
        loadChildren: () => import('./item-troca/item-troca.module').then(m => m.ItemTrocaModule),
      },
      {
        path: 'troca',
        data: { pageTitle: 'trocalivrosApp.troca.home.title' },
        loadChildren: () => import('./troca/troca.module').then(m => m.TrocaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
