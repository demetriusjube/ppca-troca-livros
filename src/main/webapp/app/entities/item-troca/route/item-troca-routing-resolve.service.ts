import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemTroca } from '../item-troca.model';
import { ItemTrocaService } from '../service/item-troca.service';

@Injectable({ providedIn: 'root' })
export class ItemTrocaRoutingResolveService implements Resolve<IItemTroca | null> {
  constructor(protected service: ItemTrocaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemTroca | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemTroca: HttpResponse<IItemTroca>) => {
          if (itemTroca.body) {
            return of(itemTroca.body);
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
