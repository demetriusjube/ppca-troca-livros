import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstanteUsuarioComponent } from '../estante-usuario/estante-usuario.component';


const trocaLivrosRoute: Routes = [
  {
    path: '',
    component: EstanteUsuarioComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(trocaLivrosRoute)],
  exports: [RouterModule],
})
export class TrocaLivrosRoutesModule { }
