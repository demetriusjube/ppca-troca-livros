import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITroca } from '../troca.model';
import { TrocaService } from '../service/troca.service';

@Injectable({ providedIn: 'root' })
export class TrocaRoutingResolveService implements Resolve<ITroca | null> {
  constructor(protected service: TrocaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITroca | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((troca: HttpResponse<ITroca>) => {
          if (troca.body) {
            return of(troca.body);
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
