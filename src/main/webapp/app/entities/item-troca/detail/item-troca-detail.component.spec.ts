import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemTrocaDetailComponent } from './item-troca-detail.component';

describe('ItemTroca Management Detail Component', () => {
  let comp: ItemTrocaDetailComponent;
  let fixture: ComponentFixture<ItemTrocaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemTrocaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemTroca: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemTrocaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemTrocaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemTroca on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemTroca).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
