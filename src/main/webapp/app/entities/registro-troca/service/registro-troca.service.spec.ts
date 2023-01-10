import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRegistroTroca } from '../registro-troca.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../registro-troca.test-samples';

import { RegistroTrocaService } from './registro-troca.service';

const requireRestSample: IRegistroTroca = {
  ...sampleWithRequiredData,
};

describe('RegistroTroca Service', () => {
  let service: RegistroTrocaService;
  let httpMock: HttpTestingController;
  let expectedResult: IRegistroTroca | IRegistroTroca[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RegistroTrocaService);
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

    it('should create a RegistroTroca', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const registroTroca = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(registroTroca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RegistroTroca', () => {
      const registroTroca = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(registroTroca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RegistroTroca', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RegistroTroca', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RegistroTroca', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRegistroTrocaToCollectionIfMissing', () => {
      it('should add a RegistroTroca to an empty array', () => {
        const registroTroca: IRegistroTroca = sampleWithRequiredData;
        expectedResult = service.addRegistroTrocaToCollectionIfMissing([], registroTroca);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registroTroca);
      });

      it('should not add a RegistroTroca to an array that contains it', () => {
        const registroTroca: IRegistroTroca = sampleWithRequiredData;
        const registroTrocaCollection: IRegistroTroca[] = [
          {
            ...registroTroca,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRegistroTrocaToCollectionIfMissing(registroTrocaCollection, registroTroca);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RegistroTroca to an array that doesn't contain it", () => {
        const registroTroca: IRegistroTroca = sampleWithRequiredData;
        const registroTrocaCollection: IRegistroTroca[] = [sampleWithPartialData];
        expectedResult = service.addRegistroTrocaToCollectionIfMissing(registroTrocaCollection, registroTroca);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registroTroca);
      });

      it('should add only unique RegistroTroca to an array', () => {
        const registroTrocaArray: IRegistroTroca[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const registroTrocaCollection: IRegistroTroca[] = [sampleWithRequiredData];
        expectedResult = service.addRegistroTrocaToCollectionIfMissing(registroTrocaCollection, ...registroTrocaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const registroTroca: IRegistroTroca = sampleWithRequiredData;
        const registroTroca2: IRegistroTroca = sampleWithPartialData;
        expectedResult = service.addRegistroTrocaToCollectionIfMissing([], registroTroca, registroTroca2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registroTroca);
        expect(expectedResult).toContain(registroTroca2);
      });

      it('should accept null and undefined values', () => {
        const registroTroca: IRegistroTroca = sampleWithRequiredData;
        expectedResult = service.addRegistroTrocaToCollectionIfMissing([], null, registroTroca, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registroTroca);
      });

      it('should return initial array if no RegistroTroca is added', () => {
        const registroTrocaCollection: IRegistroTroca[] = [sampleWithRequiredData];
        expectedResult = service.addRegistroTrocaToCollectionIfMissing(registroTrocaCollection, undefined, null);
        expect(expectedResult).toEqual(registroTrocaCollection);
      });
    });

    describe('compareRegistroTroca', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRegistroTroca(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRegistroTroca(entity1, entity2);
        const compareResult2 = service.compareRegistroTroca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRegistroTroca(entity1, entity2);
        const compareResult2 = service.compareRegistroTroca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRegistroTroca(entity1, entity2);
        const compareResult2 = service.compareRegistroTroca(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
