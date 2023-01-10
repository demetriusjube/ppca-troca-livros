import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITroca, NewTroca } from '../troca.model';

export type PartialUpdateTroca = Partial<ITroca> & Pick<ITroca, 'id'>;

type RestOf<T extends ITroca | NewTroca> = Omit<T, 'dataInicio' | 'dataFim'> & {
  dataInicio?: string | null;
  dataFim?: string | null;
};

export type RestTroca = RestOf<ITroca>;

export type NewRestTroca = RestOf<NewTroca>;

export type PartialUpdateRestTroca = RestOf<PartialUpdateTroca>;

export type EntityResponseType = HttpResponse<ITroca>;
export type EntityArrayResponseType = HttpResponse<ITroca[]>;

@Injectable({ providedIn: 'root' })
export class TrocaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trocas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(troca: NewTroca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(troca);
    return this.http.post<RestTroca>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(troca: ITroca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(troca);
    return this.http
      .put<RestTroca>(`${this.resourceUrl}/${this.getTrocaIdentifier(troca)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(troca: PartialUpdateTroca): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(troca);
    return this.http
      .patch<RestTroca>(`${this.resourceUrl}/${this.getTrocaIdentifier(troca)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTroca>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTroca[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTrocaIdentifier(troca: Pick<ITroca, 'id'>): number {
    return troca.id;
  }

  compareTroca(o1: Pick<ITroca, 'id'> | null, o2: Pick<ITroca, 'id'> | null): boolean {
    return o1 && o2 ? this.getTrocaIdentifier(o1) === this.getTrocaIdentifier(o2) : o1 === o2;
  }

  addTrocaToCollectionIfMissing<Type extends Pick<ITroca, 'id'>>(
    trocaCollection: Type[],
    ...trocasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const trocas: Type[] = trocasToCheck.filter(isPresent);
    if (trocas.length > 0) {
      const trocaCollectionIdentifiers = trocaCollection.map(trocaItem => this.getTrocaIdentifier(trocaItem)!);
      const trocasToAdd = trocas.filter(trocaItem => {
        const trocaIdentifier = this.getTrocaIdentifier(trocaItem);
        if (trocaCollectionIdentifiers.includes(trocaIdentifier)) {
          return false;
        }
        trocaCollectionIdentifiers.push(trocaIdentifier);
        return true;
      });
      return [...trocasToAdd, ...trocaCollection];
    }
    return trocaCollection;
  }

  protected convertDateFromClient<T extends ITroca | NewTroca | PartialUpdateTroca>(troca: T): RestOf<T> {
    return {
      ...troca,
      dataInicio: troca.dataInicio?.toJSON() ?? null,
      dataFim: troca.dataFim?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTroca: RestTroca): ITroca {
    return {
      ...restTroca,
      dataInicio: restTroca.dataInicio ? dayjs(restTroca.dataInicio) : undefined,
      dataFim: restTroca.dataFim ? dayjs(restTroca.dataFim) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTroca>): HttpResponse<ITroca> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTroca[]>): HttpResponse<ITroca[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
