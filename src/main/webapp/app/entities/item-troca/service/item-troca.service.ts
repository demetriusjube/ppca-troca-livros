import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemTroca, NewItemTroca } from '../item-troca.model';

export type PartialUpdateItemTroca = Partial<IItemTroca> & Pick<IItemTroca, 'id'>;

export type EntityResponseType = HttpResponse<IItemTroca>;
export type EntityArrayResponseType = HttpResponse<IItemTroca[]>;

@Injectable({ providedIn: 'root' })
export class ItemTrocaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-trocas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemTroca: NewItemTroca): Observable<EntityResponseType> {
    return this.http.post<IItemTroca>(this.resourceUrl, itemTroca, { observe: 'response' });
  }

  update(itemTroca: IItemTroca): Observable<EntityResponseType> {
    return this.http.put<IItemTroca>(`${this.resourceUrl}/${this.getItemTrocaIdentifier(itemTroca)}`, itemTroca, { observe: 'response' });
  }

  partialUpdate(itemTroca: PartialUpdateItemTroca): Observable<EntityResponseType> {
    return this.http.patch<IItemTroca>(`${this.resourceUrl}/${this.getItemTrocaIdentifier(itemTroca)}`, itemTroca, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemTroca>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemTroca[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemTrocaIdentifier(itemTroca: Pick<IItemTroca, 'id'>): number {
    return itemTroca.id;
  }

  compareItemTroca(o1: Pick<IItemTroca, 'id'> | null, o2: Pick<IItemTroca, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemTrocaIdentifier(o1) === this.getItemTrocaIdentifier(o2) : o1 === o2;
  }

  addItemTrocaToCollectionIfMissing<Type extends Pick<IItemTroca, 'id'>>(
    itemTrocaCollection: Type[],
    ...itemTrocasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemTrocas: Type[] = itemTrocasToCheck.filter(isPresent);
    if (itemTrocas.length > 0) {
      const itemTrocaCollectionIdentifiers = itemTrocaCollection.map(itemTrocaItem => this.getItemTrocaIdentifier(itemTrocaItem)!);
      const itemTrocasToAdd = itemTrocas.filter(itemTrocaItem => {
        const itemTrocaIdentifier = this.getItemTrocaIdentifier(itemTrocaItem);
        if (itemTrocaCollectionIdentifiers.includes(itemTrocaIdentifier)) {
          return false;
        }
        itemTrocaCollectionIdentifiers.push(itemTrocaIdentifier);
        return true;
      });
      return [...itemTrocasToAdd, ...itemTrocaCollection];
    }
    return itemTrocaCollection;
  }
}
