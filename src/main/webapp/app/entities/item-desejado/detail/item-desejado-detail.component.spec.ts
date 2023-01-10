import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemDesejadoDetailComponent } from './item-desejado-detail.component';

describe('ItemDesejado Management Detail Component', () => {
  let comp: ItemDesejadoDetailComponent;
  let fixture: ComponentFixture<ItemDesejadoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemDesejadoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemDesejado: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemDesejadoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemDesejadoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemDesejado on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemDesejado).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
