'use client';

import { columns, defaultVariableColumns } from '@consts/document';
import { DocumentContextType, EShowDocument } from '@customTypes/document';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import { searchArray } from '@utils/search';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const DocumentContext = createContext<DocumentContextType | null>(null);

type DocumentContextProps = {
  children: ReactNode;
  initialCustomers: Customer[];
  initialOrders: Order[];
  initialDocuments: Document[];
};

const DocumentProvider: FC<DocumentContextProps> = ({
  children,
  initialCustomers,
  initialOrders,
  initialDocuments,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocuments, setShowDocuments] = useState(EShowDocument.All);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<Document | null>(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );
  /*TODO: Improve search to only search in keys
  const searchKeys = useMemo(
    () => activeColumns.map((x) => x.field),
    [activeColumns]
  );*/
  const filteredDocuments = useMemo(() => {
    const templateValue = showDocuments === EShowDocument.Template;
    const documentsToSearch =
      showDocuments === EShowDocument.All
        ? documents
        : documents.filter((document) => document.template === templateValue);

    return searchArray(documentsToSearch, searchText);
  }, [documents, searchText, showDocuments]);

  useEffect(() => {
    setDocuments(initialDocuments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSelected = useCallback(
    (updates: Document) => {
      if (!selected) return;
      let newSelected = { ...selected };
      Object.entries(updates).forEach(([key, value]) => {
        const parsedKey = key as keyof Document;
        if (updates[parsedKey] !== undefined)
          //@ts-ignore
          newSelected[parsedKey] = value;
      });
      setSelected(newSelected);
    },
    [selected]
  );

  return (
    <DocumentContext.Provider
      value={{
        customers: initialCustomers,
        orders: initialOrders,
        documents,
        setDocuments,
        filteredDocuments,
        setShowDocuments,
        showDocuments,
        selected,
        setSelected,
        updateSelected,
        activeColumns,
        activeVariableColumns,
        setActiveVariableColumns,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
