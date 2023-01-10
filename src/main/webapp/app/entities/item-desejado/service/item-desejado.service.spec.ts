import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemDesejado } from '../item-desejado.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-desejado.test-samples';

import { ItemDesejadoService } from './item-desejado.service';

const requireRestSample: IItemDesejado = {
  ...sampleWithRequiredData,
};

describe('ItemDesejado Service', () => {
  let service: ItemDesejadoService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemDesejado | IItemDesejado[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemDesejadoService);
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

    it('should create a ItemDesejado', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemDesejado = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemDesejado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemDesejado', () => {
      const itemDesejado = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemDesejado).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemDesejado', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemDesejado', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemDesejado', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemDesejadoToCollectionIfMissing', () => {
      it('should add a ItemDesejado to an empty array', () => {
        const itemDesejado: IItemDesejado = sampleWithRequiredData;
        expectedResult = service.addItemDesejadoToCollectionIfMissing([], itemDesejado);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemDesejado);
      });

      it('should not add a ItemDesejado to an array that contains it', () => {
        const itemDesejado: IItemDesejado = sampleWithRequiredData;
        const itemDesejadoCollection: IItemDesejado[] = [
          {
            ...itemDesejado,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemDesejadoToCollectionIfMissing(itemDesejadoCollection, itemDesejado);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemDesejado to an array that doesn't contain it", () => {
        const itemDesejado: IItemDesejado = sampleWithRequiredData;
        const itemDesejadoCollection: IItemDesejado[] = [sampleWithPartialData];
        expectedResult = service.addItemDesejadoToCollectionIfMissing(itemDesejadoCollection, itemDesejado);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemDesejado);
      });

      it('should add only unique ItemDesejado to an array', () => {
        const itemDesejadoArray: IItemDesejado[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemDesejadoCollection: IItemDesejado[] = [sampleWithRequiredData];
        expectedResult = service.addItemDesejadoToCollectionIfMissing(itemDesejadoCollection, ...itemDesejadoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemDesejado: IItemDesejado = sampleWithRequiredData;
        const itemDesejado2: IItemDesejado = sampleWithPartialData;
        expectedResult = service.addItemDesejadoToCollectionIfMissing([], itemDesejado, itemDesejado2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemDesejado);
        expect(expectedResult).toContain(itemDesejado2);
      });

      it('should accept null and undefined values', () => {
        const itemDesejado: IItemDesejado = sampleWithRequiredData;
        expectedResult = service.addItemDesejadoToCollectionIfMissing([], null, itemDesejado, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemDesejado);
      });

      it('should return initial array if no ItemDesejado is added', () => {
        const itemDesejadoCollection: IItemDesejado[] = [sampleWithRequiredData];
        expectedResult = service.addItemDesejadoToCollectionIfMissing(itemDesejadoCollection, undefined, null);
        expect(expectedResult).toEqual(itemDesejadoCollection);
      });
    });

    describe('compareItemDesejado', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemDesejado(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemDesejado(entity1, entity2);
        const compareResult2 = service.compareItemDesejado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemDesejado(entity1, entity2);
        const compareResult2 = service.compareItemDesejado(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemDesejado(entity1, entity2);
        const compareResult2 = service.compareItemDesejado(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
