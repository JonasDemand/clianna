import { columns, variableColumns } from '@consts/document';
import { ICustomer } from '@customTypes/database/customer';
import { IDocumentWithDependencies } from '@customTypes/database/document';
import { IOrder } from '@customTypes/database/order';
import { DocumentContextType, EShowDocument } from '@customTypes/document';
import { searchArray } from '@utils/search';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const DocumentContext = createContext<DocumentContextType | null>(null);

type DocumentContextProps = {
  children: ReactNode;
  initialCustomers: ICustomer[];
  initialOrders: IOrder[];
  initialDocuments: IDocumentWithDependencies[];
};

const DocumentProvider: FC<DocumentContextProps> = ({
  children,
  initialCustomers,
  initialOrders,
  initialDocuments,
}) => {
  const [documents, setDocuments] = useState<IDocumentWithDependencies[]>([]);
  const [showDocuments, setShowDocuments] = useState(EShowDocument.All);
  const [activeVariableColumns, setActiveVariableColumns] =
    useState(variableColumns);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<IDocumentWithDependencies | null>(
    null
  );

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
    (updates: IDocumentWithDependencies) => {
      if (!selected) return;
      let newSelected = { ...selected };
      Object.entries(updates).forEach(([key, value]) => {
        const parsedKey = key as keyof IDocumentWithDependencies;
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
