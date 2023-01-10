import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemDesejado } from '../item-desejado.model';
import { ItemDesejadoService } from '../service/item-desejado.service';

@Injectable({ providedIn: 'root' })
export class ItemDesejadoRoutingResolveService implements Resolve<IItemDesejado | null> {
  constructor(protected service: ItemDesejadoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemDesejado | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemDesejado: HttpResponse<IItemDesejado>) => {
          if (itemDesejado.body) {
            return of(itemDesejado.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
