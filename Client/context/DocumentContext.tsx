'use client';

import { columns, defaultVariableColumns } from '@consts/document';
import { DocumentContextType, EShowDocument } from '@customTypes/document';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import {
  ColumnFilter,
  Customer,
  Document,
  Order,
} from '@utils/api/generated/Api';
import useApiClient from 'hooks/useApiClient';
import useDebounce from 'hooks/useDebounce';
import useDidMountEffect from 'hooks/useDidMountEffect';
import { useSnackbar } from 'notistack';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { usePaginationContext } from './PaginationContext';

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
  const { enqueueSnackbar } = useSnackbar();
  const ApiClient = useApiClient();
  const {
    currentPage,
    gridSortModel,
    searchText,
    setCurrentPage,
    setRowCount,
  } = usePaginationContext();

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [showDocuments, setShowDocuments] = useState(EShowDocument.All);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [selected, setSelected] = useState<Document | null>(null);
  const [filterReference, setFilterReference] = useState<
    Customer | Order | null
  >(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );

  const fetchDocuments = useDebounce(async () => {
    const columnFilters = new Array<ColumnFilter>();
    if (showDocuments !== EShowDocument.All)
      columnFilters.push({
        name: 'Template',
        value: (showDocuments === EShowDocument.Template).toString(),
      });
    if (filterReference)
      columnFilters.push({
        name: isCustomer(filterReference) ? 'CustomerId' : 'OrderId',
        value: filterReference.id,
      });
    const { data, error } = await ApiClient.document.documentList({
      ColumnFilters: withColumnFilters(columnFilters),
      ColumnSorting: withColumnSorting(
        gridSortModel.map((x) => ({
          name: x.field[0].toUpperCase().concat(x.field.slice(1)),
          desc: x.sort === 'desc',
        }))
      ),
      SearchTerm: searchText,
      PageNumber: currentPage + 1,
      PageSize: 100,
    });
    if (error || !data?.list || !data.metaData) {
      enqueueSnackbar('Unbekannter Fehler', {
        variant: 'error',
      });
      return;
    }
    setCurrentPage(data.metaData.currentPage! - 1);
    setRowCount(data.metaData.totalCount!);
    setDocuments(data.list);
  }, 750);
  useDidMountEffect(
    () => {
      fetchDocuments();
    },
    2,
    [searchText, showDocuments, gridSortModel, currentPage, filterReference]
  );

  const updateSelected = useCallback(
    (updates: Document) => {
      if (!selected) return;
      let newSelected = { ...selected };
      Object.entries(updates).forEach(
        ([key, value]) =>
          //@ts-ignore
          (newSelected[key] = value)
      );
      setSelected(newSelected);
    },
    [selected]
  );

  const isCustomer = useCallback(
    (obj?: any | null) => initialCustomers.findIndex((x) => x === obj) !== -1,
    [initialCustomers]
  );

  return (
    <DocumentContext.Provider
      value={{
        customers: initialCustomers,
        orders: initialOrders,
        documents,
        setDocuments,
        setShowDocuments,
        showDocuments,
        selected,
        setSelected,
        updateSelected,
        activeColumns,
        activeVariableColumns,
        setActiveVariableColumns,
        filterReference,
        setFilterReference,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
