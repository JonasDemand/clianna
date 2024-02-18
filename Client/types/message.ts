import { GridColDef } from '@mui/x-data-grid';
import { Customer, Message, Order } from '@utils/api/generated/Api';

import { EShowTemplate } from './template';

export type MessageContextType = {
  customers: Customer[];
  orders: Order[];
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  selected: Message | null;
  setSelected: (message: Message | null) => void;
  updateSelected: (updates: Message) => void;
  showMessages: EShowTemplate;
  setShowMessages: (state: EShowTemplate) => void;
  activeColumns: GridColDef<Message>[];
  activeVariableColumns: GridColDef<Message>[];
  setActiveVariableColumns: (activeColumns: GridColDef<Message>[]) => void;
  filterReference: Customer | Order | null;
  setFilterReference: (value: Customer | Order | null) => void;
};
