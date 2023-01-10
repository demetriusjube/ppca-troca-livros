import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemDesejado } from '../item-desejado.model';

@Component({
  selector: 'jhi-item-desejado-detail',
  templateUrl: './item-desejado-detail.component.html',
})
export class ItemDesejadoDetailComponent implements OnInit {
  itemDesejado: IItemDesejado | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemDesejado }) => {
      this.itemDesejado = itemDesejado;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
