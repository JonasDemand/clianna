import { Customer, Order } from '@prisma/client';

export interface IOrderWithCustomer extends Order {
  customer?: Customer | null;
}

export enum ShippingType {
  Send,
  Collect,
  Visit,
}

export const ShippingTypeLabel = new Map<ShippingType, string>([
  [ShippingType.Send, 'Versand'],
  [ShippingType.Collect, 'Abholung'],
  [ShippingType.Visit, 'hausbesuch'],
]);

export enum OrderType {
  Einlagen,
  Einlagenarbeiten,
  Abrolloptimierung,
  Schuharbeiten,
  Massschuhleisten,
  Massschuhe,
  Schuhbestellung,
  Miscellaneous,
}

export const OrderTypeLabel = new Map<OrderType, string>([
  [OrderType.Einlagen, 'Einlagen'],
  [OrderType.Einlagenarbeiten, 'Einlagenarbeiten'],
  [OrderType.Abrolloptimierung, 'Abrolloptimierung'],
  [OrderType.Schuharbeiten, 'Schuharbeiten'],
  [OrderType.Massschuhleisten, 'Massschuhleisten'],
  [OrderType.Massschuhe, 'Massschuhe'],
  [OrderType.Schuhbestellung, 'Schuhbestellung'],
  [OrderType.Miscellaneous, 'Sonstiges'],
]);

export enum OrderSpecification {
  Sport,
  Business,
  Casual,
  Workwear,
  SchuhleistenEinleisten,
  Erstlieferung,
  Nachlieferung,
}

export const OrderSpecificationLabel = new Map<OrderSpecification, string>([
  [OrderSpecification.Sport, 'Sport'],
  [OrderSpecification.Business, 'Business'],
  [OrderSpecification.Casual, 'Casual'],
  [OrderSpecification.Workwear, 'Workwear'],
  [OrderSpecification.SchuhleistenEinleisten, 'Schuhleisten einleisten'],
  [OrderSpecification.Erstlieferung, 'Erstlieferung'],
  [OrderSpecification.Nachlieferung, 'Nachlieferung'],
]);

export enum Brand {
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
