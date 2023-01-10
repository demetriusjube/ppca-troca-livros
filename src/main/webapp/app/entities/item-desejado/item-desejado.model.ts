import { IUser } from 'app/entities/user/user.model';
import { SituacaoItem } from 'app/entities/enumerations/situacao-item.model';

export interface IItemDesejado {
  id: number;
  nome?: string | null;
  idGlobal?: string | null;
  situacao?: SituacaoItem | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewItemDesejado = Omit<IItemDesejado, 'id'> & { id: null };
