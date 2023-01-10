import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemTrocaService } from '../service/item-troca.service';

import { ItemTrocaComponent } from './item-troca.component';

describe('ItemTroca Management Component', () => {
  let comp: ItemTrocaComponent;
  let fixture: ComponentFixture<ItemTrocaComponent>;
  let service: ItemTrocaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-troca', component: ItemTrocaComponent }]), HttpClientTestingModule],
      declarations: [ItemTrocaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ItemTrocaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemTrocaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemTrocaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.itemTrocas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemTrocaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemTrocaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemTrocaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
