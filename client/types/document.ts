import { GridColDef } from '@mui/x-data-grid';

import { ICustomer } from './database/customer';
import { IDocumentWithDependencies } from './database/document';
import { IOrder } from './database/order';

export type DocumentContextType = {
  customers: ICustomer[];
  orders: IOrder[];
  documents: IDocumentWithDependencies[];
  setDocuments: (documents: IDocumentWithDependencies[]) => void;
  filteredDocuments: IDocumentWithDependencies[];
  selected: IDocumentWithDependencies | null;
  setSelected: (document: IDocumentWithDependencies | null) => void;
  updateSelected: (updates: IDocumentWithDependencies) => void;
  showDocuments: EShowDocument;
  setShowDocuments: (state: EShowDocument) => void;
  activeColumns: GridColDef<IDocumentWithDependencies>[];
  activeVariableColumns: GridColDef<IDocumentWithDependencies>[];
  setActiveVariableColumns: (
    activeColumns: GridColDef<IDocumentWithDependencies>[]
  ) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum EShowDocument {
  All,
  Template,
  File,
}
