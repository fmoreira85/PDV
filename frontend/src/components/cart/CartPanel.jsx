import { formatCurrency } from "../../hooks/useCurrency.js";

export function CartPanel({ items, totalAmount, onIncrease, onDecrease }) {
  return (
    <section className="panel panel-cart">
      <div className="panel-header between">
        <h2>Carrinho de Compras</h2>
        <span className="badge-soft">{items.length} itens</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Carrinho vazio</p>
          <span>Adicione produtos para comecar.</span>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="cart-actions">
                  <button type="button" className="step-button" onClick={() => onDecrease(item.id)}>
                    <i className="bi bi-dash" />
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" className="step-button" onClick={() => onIncrease(item.id)}>
                    <i className="bi bi-plus" />
                  </button>
                </div>

                <strong>{formatCurrency(item.quantity * item.price)}</strong>
              </article>
            ))}
          </div>

          <div className="cart-total">
            <span>Total parcial</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
        </>
      )}
    </section>
  );
}
