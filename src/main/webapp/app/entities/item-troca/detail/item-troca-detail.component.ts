import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemTroca } from '../item-troca.model';

@Component({
  selector: 'jhi-item-troca-detail',
  templateUrl: './item-troca-detail.component.html',
})
export class ItemTrocaDetailComponent implements OnInit {
  itemTroca: IItemTroca | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemTroca }) => {
      this.itemTroca = itemTroca;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
