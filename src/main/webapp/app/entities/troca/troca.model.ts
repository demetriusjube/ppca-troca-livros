import dayjs from 'dayjs/esm';

export interface ITroca {
  id: number;
  dataInicio?: dayjs.Dayjs | null;
  dataFim?: dayjs.Dayjs | null;
  resultado?: string | null;
}

export type NewTroca = Omit<ITroca, 'id'> & { id: null };
