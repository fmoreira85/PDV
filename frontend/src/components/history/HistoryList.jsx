import { formatCurrency, formatDateTime } from "../../hooks/useCurrency.js";

export function HistoryList({ sales, loading, error }) {
  return (
    <section className="panel history-panel">
      <div className="panel-header between">
        <h2>
          <i className="bi bi-clock-history" /> Historico de Vendas
        </h2>
        <span className="badge-soft">{sales.length} registros</span>
      </div>

      {loading ? <p className="empty-state small">Carregando historico...</p> : null}
      {error ? <p className="feedback error">{error}</p> : null}

      {!loading && !error && sales.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma venda registrada</p>
          <span>Finalize uma venda no PDV para preencher esta lista.</span>
        </div>
      ) : null}

      <div className="history-list">
        {sales.map((sale) => (
          <article key={sale.id} className="history-card">
            {/* Cabecalho resume identificacao, data e total da venda. */}
            <div className="history-card-header">
              <div>
                <strong>Venda #{sale.id}</strong>
                <p>{formatDateTime(sale.createdAt)}</p>
              </div>

              <div className="history-totals">
                <span>{sale.paymentMethod}</span>
                <strong>{formatCurrency(sale.totalAmount)}</strong>
              </div>
            </div>

            {/* A lista interna detalha quais itens compuseram a venda. */}
            <ul>
              {sale.items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <strong>{formatCurrency(item.subtotal)}</strong>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
