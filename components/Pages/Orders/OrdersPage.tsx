import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { BackdropContext } from '@context/BackdropContext';
import { OrderContext } from '@context/OrderContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { IDocument } from '@customTypes/database/document';
import { IOrderWithDependencies } from '@customTypes/database/order';
import { EId } from '@customTypes/id';
import { OrderContextType } from '@customTypes/order';
import { Box, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useContext, useState } from 'react';

import OrderFrom from './Form';
import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;
  const {
    filteredOrders,
    activeColumns,
    selected,
    setSelected,
    orders,
    setOrders,
    searchText,
  } = useContext(OrderContext) as OrderContextType;

  const [orderToDelete, setOrderToDelete] =
    useState<IOrderWithDependencies | null>(null);

  const onCloseOverlay = useCallback(() => {
    if (!selected) return;
    let newOrders = [...orders];
    const index = newOrders.findIndex((order) => order.id === selected.id);
    newOrders[index] = { ...newOrders[index], documents: selected.documents };
    setOrders(newOrders);
    setSelected(null);
  }, [orders, selected, setOrders, setSelected]);
  const onCloseDialog = useCallback(() => setOrderToDelete(null), []);

  const onSaveOverlay = useCallback(async () => {
    if (!selected) return;
    if (
      isEqual(
        selected,
        orders.find((order) => order.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
        variant: 'info',
      });
      return;
    }
    let create = selected.id === EId.Create;
    let newOrders = [...orders];
    if (create) {
      const { error, response } = await ApiClient.Order.Create(selected);
      if (error || !response) {
        enqueueSnackbar('Erstellen von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newOrders.push(response);
    } else {
      const { error, response } = await ApiClient.Order.Update(
        selected.id!,
        selected
      );
      if (error || !response) {
        enqueueSnackbar('Aktualisieren von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newOrders.findIndex((order) => order.id === response.id);
      newOrders[index] = response;
    }
    setOrders(newOrders);
    setSelected(null);
    enqueueSnackbar('Erfolgreich Auftrag aktualisiert', { variant: 'success' });
  }, [enqueueSnackbar, orders, selected, setOrders, setSelected]);

  const onCopyRow = useCallback(
    async (order: IOrderWithDependencies) => {
      let documents: Array<IDocument> = [];
      if (order.documents) {
        setShowBackdrop(true);
        const createDocumentRes = await Promise.all(
          order.documents.map((document) =>
            document.id
              ? ApiClient.Document.Copy(document.id, { name: document.name })
              : ApiClient.Document.Create({ name: document.name })
          )
        );
        setShowBackdrop(false);
        if (createDocumentRes.some((res) => res.error || !res.response)) {
          enqueueSnackbar('Kopieren von Dokumenten fehlgeschlagen', {
            variant: 'error',
          });
          return;
        }
        documents = createDocumentRes.map((res) => res.response!);
      }
      setSelected({
        ...order,
        id: EId.Create,
        documents,
      });
    },
    [enqueueSnackbar, setSelected, setShowBackdrop]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!orderToDelete?.id) return;
    const { error } = await ApiClient.Order.Delete(orderToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Auftrag fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Auftrag gelöscht', { variant: 'success' });
    setOrderToDelete(null);
    setOrders(orders.filter((order) => order.id !== orderToDelete.id));
  }, [enqueueSnackbar, orderToDelete, orders, setOrders]);

  const onRowClick = useCallback(
    ({ row }: { row: IOrderWithDependencies }) => setSelected(row),
    [setSelected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<IOrderWithDependencies>
        header={<OrdersTableHeader />}
        rows={filteredOrders}
        columns={activeColumns}
        onRowClick={onRowClick}
        onCopy={onCopyRow}
        onDelete={setOrderToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading="Auftrag bearbeiten"
        open={!!selected}
        onClose={onCloseOverlay}
        onSave={onSaveOverlay}
      >
        <OrderFrom />
      </SideOverlay>
      <ConfirmDialog
        open={!!orderToDelete}
        title="Auftrag löschen"
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
      >
        <Typography mb={2}>
          Bist du dir sicher, dass Du diesen Auftrag löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          Auftrag {orderToDelete?.id}
          {orderToDelete?.customer && (
            <>
              <br />
              Für Kunde {getCustomerLabel(orderToDelete?.customer)}
            </>
          )}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default OrdersPage;
