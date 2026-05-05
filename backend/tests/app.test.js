import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { resetMemoryState } from "../src/data/repositories/memory/memoryStore.js";

describe("PDV API", () => {
  beforeEach(() => {
    // Forca um ambiente previsivel para os testes, sem dependencia de MySQL.
    process.env.STORAGE_MODE = "memory";
    resetMemoryState();
  });

  it("retorna status de saude", async () => {
    // Cada teste monta a app do zero para isolar efeitos colaterais.
    const { app } = await createApp();

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.storageMode).toBe("memory");
  });

  it("lista produtos e filtra por busca", async () => {
    const { app } = await createApp();

    // Verifica se a busca textual encontra produtos esperados.
    const response = await request(app).get("/api/products").query({ q: "coca" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toContain("Coca-Cola");
  });

  it("cria venda em dinheiro e atualiza resumo", async () => {
    const { app } = await createApp();

    // Simula o fluxo principal do PDV: vender e depois consultar o painel.
    const saleResponse = await request(app).post("/api/sales").send({
      paymentMethod: "dinheiro",
      amountReceived: 10,
      items: [{ productId: 1, quantity: 2 }]
    });

    expect(saleResponse.status).toBe(201);
    expect(saleResponse.body.totalAmount).toBe(9);
    expect(saleResponse.body.changeAmount).toBe(1);

    const summaryResponse = await request(app).get("/api/sales/summary");
    expect(summaryResponse.body.salesCount).toBe(1);
    expect(summaryResponse.body.totalRevenue).toBe(9);
  });

  it("bloqueia venda em dinheiro sem valor suficiente", async () => {
    const { app } = await createApp();

    // Garante que a validacao de caixa insuficiente protege a operacao.
    const response = await request(app).post("/api/sales").send({
      paymentMethod: "dinheiro",
      amountReceived: 4,
      items: [{ productId: 1, quantity: 2 }]
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/insuficiente/i);
  });
});
