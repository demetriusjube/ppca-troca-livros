import { Component, OnInit } from '@angular/core';
import { Book, GoogleBooksService } from 'app/core/util/google-books.service';
import { debounceTime, distinctUntilChanged, Observable, OperatorFunction, switchMap } from 'rxjs';
import { NgbTypeahead, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { IItemTroca } from 'app/entities/item-troca/item-troca.model';
import { IItemDesejado } from 'app/entities/item-desejado/item-desejado.model';
import { UserInfo } from 'os';
import { IUser } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-estante-usuario',
  templateUrl: './estante-usuario.component.html',
  styleUrls: ['./estante-usuario.component.scss']
})
export class EstanteUsuarioComponent implements OnInit {

  public livroTrocaSelecionado = GoogleBooksService.getEmptyBook();
  public livroDesejadoSelecionado = GoogleBooksService.getEmptyBook();
  public itensTrocaUsuario: IItemTroca[] = [];
  public itensDesejadosUsuario: IItemDesejado[] = [];
  public user: any;
  constructor() { }

  ngOnInit(): void {
  }



}
