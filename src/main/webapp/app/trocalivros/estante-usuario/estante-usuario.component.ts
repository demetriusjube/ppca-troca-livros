import { Component, OnInit } from '@angular/core';
import { Book, GoogleBooksService } from 'app/core/util/google-books.service';
import { debounceTime, distinctUntilChanged, Observable, OperatorFunction, switchMap } from 'rxjs';
import { NgbTypeahead, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-estante-usuario',
  templateUrl: './estante-usuario.component.html',
  styleUrls: ['./estante-usuario.component.scss']
})
export class EstanteUsuarioComponent implements OnInit {

  constructor(private googleBooksService: GoogleBooksService) { }

  ngOnInit(): void {
  }

  public model: any;

  search: OperatorFunction<string, readonly Book[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) =>
        term === ''
          ? []
          : this.googleBooksService.search(term)
      ),
      //catchError(new ErrorInfo().parseObservableResponseError)     
    );
  


  formatter = (x: { name: string }) => x.name;

}
