export function formatCurrency(value) {
  // Mantem todos os valores monetarios exibidos no padrao brasileiro.
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value ?? 0));
}

export function formatDateTime(value) {
  // Formata datas de venda em um formato compacto e legivel para o operador.
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}
