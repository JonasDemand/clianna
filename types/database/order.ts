import { Customer, Order } from '@prisma/client';

export interface IOrderWithCustomer extends Order {
  customer: Customer | null;
}

export enum EShippingType {
  Send,
  Collect,
  Visit,
}

export enum EOrderType {
  Einlagen,
  Einlagenarbeiten,
  Abrolloptimierung,
  Schuharbeiten,
  Massschuhleisten,
  Massschuhe,
  Schuhbestellung,
  Miscellaneous,
}

export enum EOrderSpecification {
  Sport,
  Business,
  Casual,
  Workwear,
  Massschuhe,
  SchuhleistenEinleisten,
  Erstlieferung,
  Nachlieferung,
}

export enum ETax {
  Nineteen,
  Seven,
}

export enum EBrand {
  Asics = 'Asics',
  Brooks = 'Brooks',
  Baer = 'Bär',
  Clarks = 'Clarks',
  Ecco = 'Ecco',
  FinnComfort = 'Finn Comfort',
  Gabor = 'Gabor',
  Ganter = 'Ganter',
  Hartjes = 'Hartjes',
  Lowa = 'Lowa',
  Meindl = 'Meindl',
  NewBalance = 'New Balance',
  Nike = 'Nike',
  Puma = 'Puma',
  Solidus = 'Solidus',
  Wolky = 'Wolky',
  Hoka = 'Hoka',
}
