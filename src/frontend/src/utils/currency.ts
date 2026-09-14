/**
 * Currency formatting utility for DockNova Maritime Control Center
 * Localized for Indian Rupee (INR / ₹)
 */

export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatCurrency = (amount: number): string => {
  return formatINR(amount);
};
