import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegistroTroca } from '../registro-troca.model';
import { RegistroTrocaService } from '../service/registro-troca.service';

@Injectable({ providedIn: 'root' })
export class RegistroTrocaRoutingResolveService implements Resolve<IRegistroTroca | null> {
  constructor(protected service: RegistroTrocaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegistroTroca | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((registroTroca: HttpResponse<IRegistroTroca>) => {
          if (registroTroca.body) {
            return of(registroTroca.body);
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
