import dayjs from 'dayjs';

export const formatDate = (
  date: string | number | Date | dayjs.Dayjs | null | undefined
) => (date ? dayjs(date).format('DD.MM.YYYY') : '');
