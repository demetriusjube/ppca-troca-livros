import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Book = {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishDate?: string;
    description?: string;
    industryIdentifiers?: [
      {
        type?: string,
        identifier?: string
      }];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}

@Injectable(
  { providedIn: 'root' })
export class GoogleBooksService {
  private API_PATH = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) { }

  public static getEmptyBook(): Book {
    return {
      id: '',
      volumeInfo: {
        title: ''
      }
    }
  }

  search(query: string): Observable<Book[]> {
    return this.http
      .get<{ items: Book[] }>(`${this.API_PATH}?q=${query}`)
      .pipe(map(books => books.items || []));
  }

  getById(volumeId: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_PATH}/${volumeId}`);
  }
}