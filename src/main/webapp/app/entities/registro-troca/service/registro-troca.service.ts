import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegistroTroca, NewRegistroTroca } from '../registro-troca.model';

export type PartialUpdateRegistroTroca = Partial<IRegistroTroca> & Pick<IRegistroTroca, 'id'>;

export type EntityResponseType = HttpResponse<IRegistroTroca>;
export type EntityArrayResponseType = HttpResponse<IRegistroTroca[]>;

@Injectable({ providedIn: 'root' })
export class RegistroTrocaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/registro-trocas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(registroTroca: NewRegistroTroca): Observable<EntityResponseType> {
    return this.http.post<IRegistroTroca>(this.resourceUrl, registroTroca, { observe: 'response' });
  }

  update(registroTroca: IRegistroTroca): Observable<EntityResponseType> {
    return this.http.put<IRegistroTroca>(`${this.resourceUrl}/${this.getRegistroTrocaIdentifier(registroTroca)}`, registroTroca, {
      observe: 'response',
    });
  }

  partialUpdate(registroTroca: PartialUpdateRegistroTroca): Observable<EntityResponseType> {
    return this.http.patch<IRegistroTroca>(`${this.resourceUrl}/${this.getRegistroTrocaIdentifier(registroTroca)}`, registroTroca, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRegistroTroca>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRegistroTroca[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRegistroTrocaIdentifier(registroTroca: Pick<IRegistroTroca, 'id'>): number {
    return registroTroca.id;
  }

  compareRegistroTroca(o1: Pick<IRegistroTroca, 'id'> | null, o2: Pick<IRegistroTroca, 'id'> | null): boolean {
    return o1 && o2 ? this.getRegistroTrocaIdentifier(o1) === this.getRegistroTrocaIdentifier(o2) : o1 === o2;
  }

  addRegistroTrocaToCollectionIfMissing<Type extends Pick<IRegistroTroca, 'id'>>(
    registroTrocaCollection: Type[],
    ...registroTrocasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const registroTrocas: Type[] = registroTrocasToCheck.filter(isPresent);
    if (registroTrocas.length > 0) {
      const registroTrocaCollectionIdentifiers = registroTrocaCollection.map(
        registroTrocaItem => this.getRegistroTrocaIdentifier(registroTrocaItem)!
      );
      const registroTrocasToAdd = registroTrocas.filter(registroTrocaItem => {
        const registroTrocaIdentifier = this.getRegistroTrocaIdentifier(registroTrocaItem);
        if (registroTrocaCollectionIdentifiers.includes(registroTrocaIdentifier)) {
          return false;
        }
        registroTrocaCollectionIdentifiers.push(registroTrocaIdentifier);
        return true;
      });
      return [...registroTrocasToAdd, ...registroTrocaCollection];
    }
    return registroTrocaCollection;
  }
}
