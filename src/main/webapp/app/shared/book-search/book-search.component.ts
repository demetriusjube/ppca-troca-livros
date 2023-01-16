import { Component, OnInit, Output } from '@angular/core';
import { Book, GoogleBooksService } from 'app/core/util/google-books.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, switchMap } from 'rxjs';
import { NgbTypeahead, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'jhi-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {

  constructor(private googleBooksService: GoogleBooksService) { }

  ngOnInit(): void {
  }

  @Output()
  public model: Book = GoogleBooksService.getEmptyBook();

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



  formatter = (livro: Book) => this.getDescricaoLivro(livro);

  public getDescricaoLivro(livro: Book): string {
    let descricao = livro.volumeInfo.title
    if (!_.isNil(livro.volumeInfo.subtitle)) {
      descricao += ' ' + livro.volumeInfo.subtitle;
    }
    if (!_.isNil(livro.volumeInfo.authors)) {
      descricao += ' - ' + livro.volumeInfo.authors.join(', ')
    }
    return descricao;
  }

}
