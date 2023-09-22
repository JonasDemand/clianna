'use client';

import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { useBackdropContext } from '@context/BackdropContext';
import { useOrderContext } from '@context/OrderContext';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { Order } from '@utils/api/generated/Api';
import { getOrderLabel } from '@utils/order';
import useApiClient from 'hooks/useApiClient';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import OrderFrom from './Form';
import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { setShowBackdrop } = useBackdropContext();
  const {
    filteredOrders,
    activeColumns,
    selected,
    setSelected,
    orders,
    setOrders,
    searchText,
  } = useOrderContext();
  const ApiClient = useApiClient();

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const onCloseOverlay = useCallback(() => {
    if (!selected) return;
    let newOrders = [...orders];
    const index = newOrders.findIndex((order) => order.id === selected.id);
    newOrders[index] = {
      ...newOrders[index],
      documents: selected.documents,
    };
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
      const { error, data } = await ApiClient.order.orderCreate(selected);
      if (error || !data) {
        enqueueSnackbar('Erstellen von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newOrders.push(data);
    } else {
      const { error, data } = await ApiClient.order.orderUpdate(
        selected.id!,
        selected
      );
      if (error || !data) {
        enqueueSnackbar('Aktualisieren von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newOrders.findIndex((order) => order.id === data.id);
      newOrders[index] = data;
    }
    setOrders(newOrders);
    setSelected(null);
    enqueueSnackbar('Erfolgreich Auftrag aktualisiert', { variant: 'success' });
  }, [
    ApiClient.order,
    enqueueSnackbar,
    orders,
    selected,
    setOrders,
    setSelected,
  ]);

  const onCopyRow = useCallback(async (order: Order) => {
    /*TODO
      let documents: Array<Document> = [];
      if (order.documents) {
        setShowBackdrop(true);
        const createDocumentRes = await Promise.all(
          order.documents.map((document) =>
            document.id
              ? Client.Document.Copy(document.id, { name: document.name })
              : Client.documentPOST(({ name: document.name }))
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
        creationDate: new Date(),
        documents,
      });*/
  }, []);

  const onConfirmDialog = useCallback(async () => {
    if (!orderToDelete?.id) return;
    const { error } = await ApiClient.order.orderDelete(orderToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Auftrag fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Auftrag gelöscht', { variant: 'success' });
    setOrderToDelete(null);
    setOrders(orders.filter((order) => order.id !== orderToDelete.id));
  }, [ApiClient.order, enqueueSnackbar, orderToDelete?.id, orders, setOrders]);

  const onRowClick = useCallback(
    ({ row }: { row: Order }) => setSelected(row),
    [setSelected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<Order>
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
          {getOrderLabel(orderToDelete)}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default OrdersPage;
