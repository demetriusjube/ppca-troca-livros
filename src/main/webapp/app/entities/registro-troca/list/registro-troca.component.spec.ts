import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RegistroTrocaService } from '../service/registro-troca.service';

import { RegistroTrocaComponent } from './registro-troca.component';

describe('RegistroTroca Management Component', () => {
  let comp: RegistroTrocaComponent;
  let fixture: ComponentFixture<RegistroTrocaComponent>;
  let service: RegistroTrocaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'registro-troca', component: RegistroTrocaComponent }]), HttpClientTestingModule],
      declarations: [RegistroTrocaComponent],
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
      .overrideTemplate(RegistroTrocaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistroTrocaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RegistroTrocaService);

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
    expect(comp.registroTrocas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to registroTrocaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRegistroTrocaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRegistroTrocaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
