export const convertCurrency = (currency: string) => {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    case 'GBP':
      return '£';
    case 'MAD':
      return 'DH';
    default:
      return currency;
  }
};
