import { IUser } from 'app/entities/user/user.model';
import { ITroca } from 'app/entities/troca/troca.model';
import { SituacaoItem } from 'app/entities/enumerations/situacao-item.model';

export interface IItemTroca {
  id: number;
  nome?: string | null;
  idGlobal?: string | null;
  situacao?: SituacaoItem | null;
  user?: Pick<IUser, 'id'> | null;
  troca?: Pick<ITroca, 'id'> | null;
}

export type NewItemTroca = Omit<IItemTroca, 'id'> & { id: null };
