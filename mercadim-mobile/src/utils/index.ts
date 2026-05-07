export const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatNotificationDate = (dateString: string, locale: string = 'pt-BR'): string => {
  // Garante que a string seja tratada como UTC se não tiver timezone definido
  const normalizedDate = dateString.includes('Z') || dateString.includes('+') 
    ? dateString 
    : dateString.replace(' ', 'T') + 'Z';
    
  const date = new Date(normalizedDate);
  const weekday = date.toLocaleString(locale, { weekday: 'long' });
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${weekday.toLowerCase()}, ${time}`;
};
