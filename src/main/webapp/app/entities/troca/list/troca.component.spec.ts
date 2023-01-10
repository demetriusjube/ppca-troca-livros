import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TrocaService } from '../service/troca.service';

import { TrocaComponent } from './troca.component';

describe('Troca Management Component', () => {
  let comp: TrocaComponent;
  let fixture: ComponentFixture<TrocaComponent>;
  let service: TrocaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'troca', component: TrocaComponent }]), HttpClientTestingModule],
      declarations: [TrocaComponent],
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
      .overrideTemplate(TrocaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrocaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TrocaService);

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
    expect(comp.trocas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to trocaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTrocaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTrocaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
