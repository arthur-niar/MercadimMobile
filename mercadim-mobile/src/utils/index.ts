export const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatNotificationDate = (dateString: string, locale: string = 'pt-BR'): string => {
  const date = new Date(dateString);
  const weekday = date.toLocaleString(locale, { weekday: 'long' });
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${weekday.toLowerCase()}, ${time}`;
};
