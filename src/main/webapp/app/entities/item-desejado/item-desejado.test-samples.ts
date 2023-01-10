import { SituacaoItem } from 'app/entities/enumerations/situacao-item.model';

import { IItemDesejado, NewItemDesejado } from './item-desejado.model';

export const sampleWithRequiredData: IItemDesejado = {
  id: 18295,
};

export const sampleWithPartialData: IItemDesejado = {
  id: 25964,
  nome: 'Response prata Amazonas',
};

export const sampleWithFullData: IItemDesejado = {
  id: 74647,
  nome: 'ferrugem Polônia Persevering',
  idGlobal: 'needs-based FTP',
  situacao: SituacaoItem['INDISPONIVEL'],
};

export const sampleWithNewData: NewItemDesejado = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
