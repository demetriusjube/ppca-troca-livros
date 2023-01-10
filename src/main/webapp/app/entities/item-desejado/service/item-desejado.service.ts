import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemDesejado, NewItemDesejado } from '../item-desejado.model';

export type PartialUpdateItemDesejado = Partial<IItemDesejado> & Pick<IItemDesejado, 'id'>;

export type EntityResponseType = HttpResponse<IItemDesejado>;
export type EntityArrayResponseType = HttpResponse<IItemDesejado[]>;

@Injectable({ providedIn: 'root' })
export class ItemDesejadoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-desejados');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemDesejado: NewItemDesejado): Observable<EntityResponseType> {
    return this.http.post<IItemDesejado>(this.resourceUrl, itemDesejado, { observe: 'response' });
  }

  update(itemDesejado: IItemDesejado): Observable<EntityResponseType> {
    return this.http.put<IItemDesejado>(`${this.resourceUrl}/${this.getItemDesejadoIdentifier(itemDesejado)}`, itemDesejado, {
      observe: 'response',
    });
  }

  partialUpdate(itemDesejado: PartialUpdateItemDesejado): Observable<EntityResponseType> {
    return this.http.patch<IItemDesejado>(`${this.resourceUrl}/${this.getItemDesejadoIdentifier(itemDesejado)}`, itemDesejado, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemDesejado>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemDesejado[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemDesejadoIdentifier(itemDesejado: Pick<IItemDesejado, 'id'>): number {
    return itemDesejado.id;
  }

  compareItemDesejado(o1: Pick<IItemDesejado, 'id'> | null, o2: Pick<IItemDesejado, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemDesejadoIdentifier(o1) === this.getItemDesejadoIdentifier(o2) : o1 === o2;
  }

  addItemDesejadoToCollectionIfMissing<Type extends Pick<IItemDesejado, 'id'>>(
    itemDesejadoCollection: Type[],
    ...itemDesejadosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemDesejados: Type[] = itemDesejadosToCheck.filter(isPresent);
    if (itemDesejados.length > 0) {
      const itemDesejadoCollectionIdentifiers = itemDesejadoCollection.map(
        itemDesejadoItem => this.getItemDesejadoIdentifier(itemDesejadoItem)!
      );
      const itemDesejadosToAdd = itemDesejados.filter(itemDesejadoItem => {
        const itemDesejadoIdentifier = this.getItemDesejadoIdentifier(itemDesejadoItem);
        if (itemDesejadoCollectionIdentifiers.includes(itemDesejadoIdentifier)) {
          return false;
        }
        itemDesejadoCollectionIdentifiers.push(itemDesejadoIdentifier);
        return true;
      });
      return [...itemDesejadosToAdd, ...itemDesejadoCollection];
    }
    return itemDesejadoCollection;
  }
}
