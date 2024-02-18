import { EShowTemplate } from '@customTypes/template';
import { ETemplateType } from '@utils/api/generated/Api';

export const ShowTemplateLabels = new Map<EShowTemplate, string>([
  [EShowTemplate.All, 'Alle'],
  [EShowTemplate.CustomerTemplate, 'Kunden-Templates'],
  [EShowTemplate.OrderTemplate, 'Auftrags-Templates'],
  [EShowTemplate.None, 'Keine Templates'],
]);

export const TemplateTypeLabels = new Map<ETemplateType, string>([
  [ETemplateType.Customer, 'Kunden-Template'],
  [ETemplateType.Order, 'Auftrags-Template'],
  [ETemplateType.None, 'Keine Template'],
]);
