import { GridColDef } from '@mui/x-data-grid';
import { Customer, Document, Order } from '@utils/api/generated/Api';

import { EShowTemplate } from './template';

export type DocumentContextType = {
  customers: Customer[];
  orders: Order[];
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  selected: Document | null;
  setSelected: (document: Document | null) => void;
  updateSelected: (updates: Document) => void;
  showDocuments: EShowTemplate;
  setShowDocuments: (state: EShowTemplate) => void;
  activeColumns: GridColDef<Document>[];
  activeVariableColumns: GridColDef<Document>[];
  setActiveVariableColumns: (activeColumns: GridColDef<Document>[]) => void;
  filterReference: Customer | Order | null;
  setFilterReference: (value: Customer | Order | null) => void;
};
