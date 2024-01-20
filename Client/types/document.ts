import { GridColDef } from '@mui/x-data-grid';
import { Customer, Document, Order } from '@utils/api/generated/Api';

export type DocumentContextType = {
  customers: Customer[];
  orders: Order[];
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  selected: Document | null;
  setSelected: (document: Document | null) => void;
  updateSelected: (updates: Document) => void;
  showDocuments: EShowDocument;
  setShowDocuments: (state: EShowDocument) => void;
  activeColumns: GridColDef<Document>[];
  activeVariableColumns: GridColDef<Document>[];
  setActiveVariableColumns: (activeColumns: GridColDef<Document>[]) => void;
  filterReference: Customer | Order | null;
  setFilterReference: (value: Customer | Order | null) => void;
};

export enum EShowDocument {
  All,
  Template,
  File,
}
