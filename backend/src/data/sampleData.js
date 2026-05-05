// Massa inicial usada no modo em memoria para desenvolvimento e testes.
export const sampleProducts = [
  {
    id: 1,
    name: "Coca-Cola 350ml",
    category: "Bebidas",
    barcode: "7894900011517",
    price: 4.5,
    stock: 50
  },
  {
    id: 2,
    name: "Pao de Acucar",
    category: "Padaria",
    barcode: "7891000100103",
    price: 2.2,
    stock: 30
  },
  {
    id: 3,
    name: "Leite Integral 1L",
    category: "Laticinios",
    barcode: "7891025301513",
    price: 6.8,
    stock: 25
  },
  {
    id: 4,
    name: "Arroz Tipo 1 5kg",
    category: "Mercearia",
    barcode: "7896006716112",
    price: 28.9,
    stock: 18
  },
  {
    id: 5,
    name: "Feijao Carioca 1kg",
    category: "Mercearia",
    barcode: "7893500025213",
    price: 8.75,
    stock: 40
  },
  {
    id: 6,
    name: "Sabonete Suave",
    category: "Higiene",
    barcode: "7891150067014",
    price: 3.9,
    stock: 60
  }
];

export function createMemorySeed() {
  return {
    // Clona produtos para evitar que alteracoes de estoque modifiquem a lista base.
    products: sampleProducts.map((product) => ({ ...product })),
    sales: [],
    saleItems: [],
    nextSaleId: 1,
    nextSaleItemId: 1
  };
}
