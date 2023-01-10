import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemDesejadoService } from '../service/item-desejado.service';

import { ItemDesejadoComponent } from './item-desejado.component';

describe('ItemDesejado Management Component', () => {
  let comp: ItemDesejadoComponent;
  let fixture: ComponentFixture<ItemDesejadoComponent>;
  let service: ItemDesejadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-desejado', component: ItemDesejadoComponent }]), HttpClientTestingModule],
      declarations: [ItemDesejadoComponent],
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
      .overrideTemplate(ItemDesejadoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemDesejadoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemDesejadoService);

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
    expect(comp.itemDesejados?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemDesejadoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemDesejadoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemDesejadoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
