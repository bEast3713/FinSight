export const formatBillions = (value: number) => `$${value.toFixed(1)}B`;

export const formatTrillions = (value: number) => `$${(value / 1000).toFixed(2)}T`;

export const formatPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
