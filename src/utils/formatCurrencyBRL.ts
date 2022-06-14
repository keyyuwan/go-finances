export function formatCurrencyBRL(amount: number | string) {
  const amountFormatted = typeof amount === "string" ? Number(amount) : amount;

  return amountFormatted.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
