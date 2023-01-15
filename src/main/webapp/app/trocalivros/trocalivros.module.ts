import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstanteUsuarioComponent } from './estante-usuario/estante-usuario.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EstanteUsuarioComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule, 
    FormsModule,
    SharedModule,
    NgbTypeaheadModule
    
  ]
})
export class TrocalivrosModule { }
