import { EId } from '@customTypes/id';

export const getCopyId = (id: string) => id.replace(`${EId.Copy}_`, '');
