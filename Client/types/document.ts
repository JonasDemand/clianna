import { GridColDef } from '@mui/x-data-grid';
import {
  Customer,
  Document,
  Order,
} from '@utils/api/generated/GENERATED_Client';

export type DocumentContextType = {
  customers: Customer[];
  orders: Order[];
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  filteredDocuments: Document[];
  selected: Document | null;
  setSelected: (document: Document | null) => void;
  updateSelected: (updates: Document) => void;
  showDocuments: EShowDocument;
  setShowDocuments: (state: EShowDocument) => void;
  activeColumns: GridColDef<Document>[];
  activeVariableColumns: GridColDef<Document>[];
  setActiveVariableColumns: (activeColumns: GridColDef<Document>[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum EShowDocument {
  All,
  Template,
  File,
}
