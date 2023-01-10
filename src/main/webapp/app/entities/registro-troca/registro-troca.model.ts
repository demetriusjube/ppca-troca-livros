import { IItemTroca } from 'app/entities/item-troca/item-troca.model';
import { ITroca } from 'app/entities/troca/troca.model';

export interface IRegistroTroca {
  id: number;
  aceite?: boolean | null;
  origem?: Pick<IItemTroca, 'id'> | null;
  destino?: Pick<IItemTroca, 'id'> | null;
  troca?: Pick<ITroca, 'id'> | null;
}

export type NewRegistroTroca = Omit<IRegistroTroca, 'id'> & { id: null };
