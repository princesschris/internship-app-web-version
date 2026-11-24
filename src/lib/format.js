export const naira = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

export const shortDate = (d) =>
  new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })