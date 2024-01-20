'use client';

import { PaginationContextType } from '@customTypes/pagination';
import { GridSortModel } from '@mui/x-data-grid';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from 'react';

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const PaginationContext = createContext<PaginationContextType | null>(null);

type PaginationContextProps = {
  children: ReactNode;
  initialRowsCount?: number;
  initalSortModel?: GridSortModel;
};

const PaginationProvider: FC<PaginationContextProps> = ({
  children,
  initialRowsCount = 0,
  initalSortModel = [],
}) => {
  const [searchText, setSearchText] = useState('');
  const [gridSortModel, setGridSortModel] =
    useState<GridSortModel>(initalSortModel);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowCount, setRowCount] = useState(initialRowsCount);

  return (
    <PaginationContext.Provider
      value={{
        searchText,
        setSearchText,
        gridSortModel,
        setGridSortModel,
        currentPage,
        setCurrentPage,
        rowCount,
        setRowCount,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export default PaginationProvider;
