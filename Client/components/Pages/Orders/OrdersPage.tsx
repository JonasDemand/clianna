'use client';

import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import DhlDialog from '@components/Modals/DhlDialog';
import MessageDialog from '@components/Modals/MessageDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { useBackdropContext } from '@context/BackdropContext';
import { useOrderContext } from '@context/OrderContext';
import { EId } from '@customTypes/id';
import { Email, LocalShipping, Phone } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import { getOrderLabel, toOrderUpsertRequest } from '@utils/order';
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
    activeColumns,
    selected,
    setSelected,
    orders,
    setOrders,
    messageTemplates,
  } = useOrderContext();
  const ApiClient = useApiClient();

  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [dhlCustomer, setDhlCustomer] = useState<Customer | null>(null);
  const [messageOrder, setMessageOrder] = useState<Customer | null>(null);

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

  const onCloseDeleteDialog = useCallback(() => setOrderToDelete(null), []);
  const onCloseDHLDialog = useCallback(() => setDhlCustomer(null), []);
  const onCloseMessageDialog = useCallback(() => setMessageOrder(null), []);

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
      const { error, data } = await ApiClient.order.orderCreate(
        toOrderUpsertRequest(selected)
      );
      if (error || !data) {
        enqueueSnackbar('Erstellen von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newOrders.unshift(data);
    } else {
      const { error, data } = await ApiClient.order.orderUpdate(
        selected.id!,
        toOrderUpsertRequest(selected)
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

  const onCopyRow = useCallback(
    async (order: Order) => {
      let documents: Array<Document> = [];
      if (order.documents) {
        setShowBackdrop(true);
        const createDocumentRes = await Promise.all(
          order.documents.map((document) =>
            document.id
              ? ApiClient.document.copyCreate(document.id, {
                  name: document.name,
                })
              : ApiClient.document.documentCreate({ name: document.name })
          )
        );
        setShowBackdrop(false);
        if (createDocumentRes.some((res) => res.error || !res.data)) {
          enqueueSnackbar('Kopieren von Dokumenten fehlgeschlagen', {
            variant: 'error',
          });
          return;
        }
        documents = createDocumentRes.map((res) => res.data!);
      }
      setSelected({
        ...order,
        id: EId.Create,
        creationDate: new Date(),
        documents,
      });
    },
    [ApiClient.document, enqueueSnackbar, setSelected, setShowBackdrop]
  );

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
        rows={orders}
        columns={activeColumns}
        onRowClick={onRowClick}
        onCopy={onCopyRow}
        onDelete={setOrderToDelete}
        customActions={[
          {
            tooltip: 'DHL-Pollingclient Download',
            icon: <LocalShipping />,
            disabled: (row) =>
              !row.customer ||
              !row.customer.city ||
              !row.customer.firstName ||
              !row.customer.lastName ||
              !row.customer.street ||
              !row.customer.streetNumber,
            onClick: (row) => setDhlCustomer(row.customer!),
          },
          {
            tooltip: 'E-Mail',
            icon: <Email />,
            disabled: (row) => !row.customer || !row.customer.email,
            onClick: (row) => setMessageOrder(row),
          },
          {
            tooltip: 'Telefon',
            icon: <Phone />,
            disabled: (row) =>
              !row.customer || (!row.customer.mobile && !row.customer.phone),
            onClick: (row) =>
              (window.location.href = `tel:${encodeURIComponent(
                row.customer!.mobile ?? row.customer!.phone!
              )}`),
          },
        ]}
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
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDialog}
      >
        <Typography mb={2}>
          Bist du dir sicher, dass Du diesen Auftrag löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          {getOrderLabel(orderToDelete)}
        </Typography>
      </ConfirmDialog>
      <DhlDialog customer={dhlCustomer} onClose={onCloseDHLDialog} />
      <MessageDialog
        templates={messageTemplates}
        onClose={onCloseMessageDialog}
        reference={messageOrder}
      />
    </Box>
  );
};

export default OrdersPage;
