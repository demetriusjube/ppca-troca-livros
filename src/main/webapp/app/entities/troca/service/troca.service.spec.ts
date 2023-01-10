import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITroca } from '../troca.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../troca.test-samples';

import { TrocaService, RestTroca } from './troca.service';

const requireRestSample: RestTroca = {
  ...sampleWithRequiredData,
  dataInicio: sampleWithRequiredData.dataInicio?.toJSON(),
  dataFim: sampleWithRequiredData.dataFim?.toJSON(),
};

describe('Troca Service', () => {
  let service: TrocaService;
  let httpMock: HttpTestingController;
  let expectedResult: ITroca | ITroca[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TrocaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Troca', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const troca = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(troca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Troca', () => {
      const troca = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(troca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Troca', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Troca', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Troca', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTrocaToCollectionIfMissing', () => {
      it('should add a Troca to an empty array', () => {
        const troca: ITroca = sampleWithRequiredData;
        expectedResult = service.addTrocaToCollectionIfMissing([], troca);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(troca);
      });

      it('should not add a Troca to an array that contains it', () => {
        const troca: ITroca = sampleWithRequiredData;
        const trocaCollection: ITroca[] = [
          {
            ...troca,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTrocaToCollectionIfMissing(trocaCollection, troca);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Troca to an array that doesn't contain it", () => {
        const troca: ITroca = sampleWithRequiredData;
        const trocaCollection: ITroca[] = [sampleWithPartialData];
        expectedResult = service.addTrocaToCollectionIfMissing(trocaCollection, troca);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(troca);
      });

      it('should add only unique Troca to an array', () => {
        const trocaArray: ITroca[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const trocaCollection: ITroca[] = [sampleWithRequiredData];
        expectedResult = service.addTrocaToCollectionIfMissing(trocaCollection, ...trocaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const troca: ITroca = sampleWithRequiredData;
        const troca2: ITroca = sampleWithPartialData;
        expectedResult = service.addTrocaToCollectionIfMissing([], troca, troca2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(troca);
        expect(expectedResult).toContain(troca2);
      });

      it('should accept null and undefined values', () => {
        const troca: ITroca = sampleWithRequiredData;
        expectedResult = service.addTrocaToCollectionIfMissing([], null, troca, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(troca);
      });

      it('should return initial array if no Troca is added', () => {
        const trocaCollection: ITroca[] = [sampleWithRequiredData];
        expectedResult = service.addTrocaToCollectionIfMissing(trocaCollection, undefined, null);
        expect(expectedResult).toEqual(trocaCollection);
      });
    });

    describe('compareTroca', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTroca(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTroca(entity1, entity2);
        const compareResult2 = service.compareTroca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTroca(entity1, entity2);
        const compareResult2 = service.compareTroca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTroca(entity1, entity2);
        const compareResult2 = service.compareTroca(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
