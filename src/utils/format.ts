export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCrypto = (value: number): string => {
  // If the holding is very small precision logic
  if (value === 0) return '0.00';
  if (value < 0.00001) return value.toExponential(4);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(value);
};
