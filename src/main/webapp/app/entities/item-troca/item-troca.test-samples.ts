import { SituacaoItem } from 'app/entities/enumerations/situacao-item.model';

import { IItemTroca, NewItemTroca } from './item-troca.model';

export const sampleWithRequiredData: IItemTroca = {
  id: 48393,
};

export const sampleWithPartialData: IItemTroca = {
  id: 53486,
  idGlobal: 'Madeira',
  situacao: SituacaoItem['INDISPONIVEL'],
};

export const sampleWithFullData: IItemTroca = {
  id: 6314,
  nome: 'Refinado deposit calculating',
  idGlobal: 'Manager Roraima hacking',
  situacao: SituacaoItem['TROCADO'],
};

export const sampleWithNewData: NewItemTroca = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
