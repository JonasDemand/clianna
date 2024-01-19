import { GridSortModel } from '@mui/x-data-grid';

export type PaginationContextType = {
  searchText: string;
  setSearchText: (text: string) => void;
  gridSortModel: GridSortModel;
  setGridSortModel: (value: GridSortModel) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  rowCount: number;
  setRowCount: (value: number) => void;
};
