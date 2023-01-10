import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegistroTroca } from '../registro-troca.model';

@Component({
  selector: 'jhi-registro-troca-detail',
  templateUrl: './registro-troca-detail.component.html',
})
export class RegistroTrocaDetailComponent implements OnInit {
  registroTroca: IRegistroTroca | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroTroca }) => {
      this.registroTroca = registroTroca;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
