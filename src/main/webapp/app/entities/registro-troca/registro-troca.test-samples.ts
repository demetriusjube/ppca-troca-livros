import { IRegistroTroca, NewRegistroTroca } from './registro-troca.model';

export const sampleWithRequiredData: IRegistroTroca = {
  id: 72626,
};

export const sampleWithPartialData: IRegistroTroca = {
  id: 28823,
};

export const sampleWithFullData: IRegistroTroca = {
  id: 12376,
  aceite: false,
};

export const sampleWithNewData: NewRegistroTroca = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
