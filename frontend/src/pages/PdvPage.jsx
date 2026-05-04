import { useEffect, useMemo, useState } from "react";

import { createSale, fetchProducts, fetchSummary } from "../api/pdvApi.js";
import { CartPanel } from "../components/cart/CartPanel.jsx";
import { PaymentPanel } from "../components/payment/PaymentPanel.jsx";
import { ProductList } from "../components/products/ProductList.jsx";
import { formatCurrency } from "../hooks/useCurrency.js";

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function PdvPage() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ salesCount: 0, totalRevenue: 0 });
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [amountReceived, setAmountReceived] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const data = await fetchProducts(search, { signal: controller.signal });
        setProducts(data);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message ?? "Nao foi possivel carregar produtos.");
      } finally {
        setLoadingProducts(false);
      }
    }

    const timeoutId = window.setTimeout(loadProducts, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await fetchSummary();
        setSummary(data);
      } catch (_error) {
        setSummary({ salesCount: 0, totalRevenue: 0 });
      }
    }

    loadSummary();
  }, []);

  const totalAmount = useMemo(
    () =>
      roundCurrency(
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      ),
    [cartItems]
  );

  const numericAmountReceived = roundCurrency(amountReceived || 0);
  const changeAmount =
    paymentMethod === "dinheiro"
      ? Math.max(roundCurrency(numericAmountReceived - totalAmount), 0)
      : 0;

  function addToCart(product) {
    setMessage("");
    setError("");
    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);

      if (existing) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function increaseItem(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseItem(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function refreshSummaryAndProducts() {
    const [productsData, summaryData] = await Promise.all([
      fetchProducts(search),
      fetchSummary()
    ]);

    setProducts(productsData);
    setSummary(summaryData);
  }

  async function handleSubmitSale() {
    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      const createdSale = await createSale({
        paymentMethod,
        amountReceived: paymentMethod === "dinheiro" ? numericAmountReceived : totalAmount,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      await refreshSummaryAndProducts();
      setCartItems([]);
      setAmountReceived("");
      setMessage(
        `Venda #${createdSale.id} finalizada com sucesso. Troco: ${formatCurrency(createdSale.changeAmount)}`
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Nao foi possivel finalizar a venda.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="dashboard-grid">
      <div className="summary-strip">
        <span className="metric-pill">
          <i className="bi bi-currency-dollar" /> Hoje: <strong>{formatCurrency(summary.totalRevenue)}</strong>
        </span>
        <span className="metric-pill muted">
          <strong>{summary.salesCount}</strong> vendas realizadas
        </span>
      </div>

      <ProductList
        products={products}
        loading={loadingProducts}
        onAdd={addToCart}
        search={search}
        onSearchChange={setSearch}
      />

      <CartPanel
        items={cartItems}
        totalAmount={totalAmount}
        onIncrease={increaseItem}
        onDecrease={decreaseItem}
      />

      <PaymentPanel
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        amountReceived={amountReceived}
        changeAmount={changeAmount}
        canSubmit={cartItems.length > 0}
        submitting={submitting}
        message={message}
        error={error}
        onPaymentMethodChange={setPaymentMethod}
        onAmountReceivedChange={setAmountReceived}
        onExactAmount={() => setAmountReceived(totalAmount.toFixed(2))}
        onQuickAmount={(value) => setAmountReceived(String(value))}
        onSubmit={handleSubmitSale}
      />
    </section>
  );
}
