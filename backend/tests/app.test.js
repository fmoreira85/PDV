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

  async function createAuthenticatedHeaders(app) {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Operador Teste",
      email: "operador@pdv.local",
      password: "123456"
    });

    return {
      Authorization: `Bearer ${registerResponse.body.token}`
    };
  }

  it("retorna status de saude", async () => {
    // Cada teste monta a app do zero para isolar efeitos colaterais.
    const { app } = await createApp();

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.storageMode).toBe("memory");
  });

  it("registra usuario, faz login e consulta o perfil autenticado", async () => {
    const { app } = await createApp();

    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Caixa Maria",
      email: "maria@pdv.local",
      password: "123456"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe("maria@pdv.local");
    expect(registerResponse.body.token).toBeTruthy();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "maria@pdv.local",
      password: "123456"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.name).toBe("Caixa Maria");

    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.email).toBe("maria@pdv.local");
  });

  it("lista produtos e filtra por busca", async () => {
    const { app } = await createApp();
    const headers = await createAuthenticatedHeaders(app);

    // Verifica se a busca textual encontra produtos esperados.
    const response = await request(app).get("/api/products").set(headers).query({ q: "coca" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toContain("Coca-Cola");
  });

  it("cria venda em dinheiro e atualiza resumo", async () => {
    const { app } = await createApp();
    const headers = await createAuthenticatedHeaders(app);

    // Simula o fluxo principal do PDV: vender e depois consultar o painel.
    const saleResponse = await request(app)
      .post("/api/sales")
      .set(headers)
      .send({
        paymentMethod: "dinheiro",
        amountReceived: 10,
        items: [{ productId: 1, quantity: 2 }]
      });

    expect(saleResponse.status).toBe(201);
    expect(saleResponse.body.totalAmount).toBe(9);
    expect(saleResponse.body.changeAmount).toBe(1);

    const summaryResponse = await request(app).get("/api/sales/summary").set(headers);
    expect(summaryResponse.body.salesCount).toBe(1);
    expect(summaryResponse.body.totalRevenue).toBe(9);
  });

  it("bloqueia venda em dinheiro sem valor suficiente", async () => {
    const { app } = await createApp();
    const headers = await createAuthenticatedHeaders(app);

    // Garante que a validacao de caixa insuficiente protege a operacao.
    const response = await request(app)
      .post("/api/sales")
      .set(headers)
      .send({
        paymentMethod: "dinheiro",
        amountReceived: 4,
        items: [{ productId: 1, quantity: 2 }]
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/insuficiente/i);
  });
});
