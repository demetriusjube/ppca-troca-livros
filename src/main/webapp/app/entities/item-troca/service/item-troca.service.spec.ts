import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemTroca } from '../item-troca.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-troca.test-samples';

import { ItemTrocaService } from './item-troca.service';

const requireRestSample: IItemTroca = {
  ...sampleWithRequiredData,
};

describe('ItemTroca Service', () => {
  let service: ItemTrocaService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemTroca | IItemTroca[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemTrocaService);
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

    it('should create a ItemTroca', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemTroca = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemTroca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemTroca', () => {
      const itemTroca = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemTroca).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemTroca', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemTroca', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemTroca', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemTrocaToCollectionIfMissing', () => {
      it('should add a ItemTroca to an empty array', () => {
        const itemTroca: IItemTroca = sampleWithRequiredData;
        expectedResult = service.addItemTrocaToCollectionIfMissing([], itemTroca);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemTroca);
      });

      it('should not add a ItemTroca to an array that contains it', () => {
        const itemTroca: IItemTroca = sampleWithRequiredData;
        const itemTrocaCollection: IItemTroca[] = [
          {
            ...itemTroca,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemTrocaToCollectionIfMissing(itemTrocaCollection, itemTroca);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemTroca to an array that doesn't contain it", () => {
        const itemTroca: IItemTroca = sampleWithRequiredData;
        const itemTrocaCollection: IItemTroca[] = [sampleWithPartialData];
        expectedResult = service.addItemTrocaToCollectionIfMissing(itemTrocaCollection, itemTroca);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemTroca);
      });

      it('should add only unique ItemTroca to an array', () => {
        const itemTrocaArray: IItemTroca[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemTrocaCollection: IItemTroca[] = [sampleWithRequiredData];
        expectedResult = service.addItemTrocaToCollectionIfMissing(itemTrocaCollection, ...itemTrocaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemTroca: IItemTroca = sampleWithRequiredData;
        const itemTroca2: IItemTroca = sampleWithPartialData;
        expectedResult = service.addItemTrocaToCollectionIfMissing([], itemTroca, itemTroca2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemTroca);
        expect(expectedResult).toContain(itemTroca2);
      });

      it('should accept null and undefined values', () => {
        const itemTroca: IItemTroca = sampleWithRequiredData;
        expectedResult = service.addItemTrocaToCollectionIfMissing([], null, itemTroca, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemTroca);
      });

      it('should return initial array if no ItemTroca is added', () => {
        const itemTrocaCollection: IItemTroca[] = [sampleWithRequiredData];
        expectedResult = service.addItemTrocaToCollectionIfMissing(itemTrocaCollection, undefined, null);
        expect(expectedResult).toEqual(itemTrocaCollection);
      });
    });

    describe('compareItemTroca', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemTroca(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemTroca(entity1, entity2);
        const compareResult2 = service.compareItemTroca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemTroca(entity1, entity2);
        const compareResult2 = service.compareItemTroca(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemTroca(entity1, entity2);
        const compareResult2 = service.compareItemTroca(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
