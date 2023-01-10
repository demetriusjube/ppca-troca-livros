import dayjs from 'dayjs/esm';

import { ITroca, NewTroca } from './troca.model';

export const sampleWithRequiredData: ITroca = {
  id: 66757,
};

export const sampleWithPartialData: ITroca = {
  id: 32027,
  dataInicio: dayjs('2023-01-09T12:50'),
  resultado: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: ITroca = {
  id: 91926,
  dataInicio: dayjs('2023-01-09T10:30'),
  dataFim: dayjs('2023-01-09T19:42'),
  resultado: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewTroca = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
