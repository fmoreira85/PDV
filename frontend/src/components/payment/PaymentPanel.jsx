import { formatCurrency } from "../../hooks/useCurrency.js";

const paymentOptions = [
  { value: "dinheiro", label: "Dinheiro", icon: "bi-cash-coin" },
  { value: "credito", label: "Cartao de Credito", icon: "bi-credit-card" },
  { value: "debito", label: "Cartao de Debito", icon: "bi-credit-card-2-front" },
  { value: "pix", label: "PIX", icon: "bi-phone" }
];

const quickAmounts = [20, 50, 100];

export function PaymentPanel({
  totalAmount,
  paymentMethod,
  amountReceived,
  changeAmount,
  canSubmit,
  submitting,
  message,
  error,
  onPaymentMethodChange,
  onAmountReceivedChange,
  onExactAmount,
  onQuickAmount,
  onSubmit
}) {
  const cashPayment = paymentMethod === "dinheiro";

  return (
    <section className="panel panel-payment">
      <div className="panel-header">
        <h2>
          <i className="bi bi-wallet2" /> Pagamento
        </h2>
      </div>

      <div className="payment-summary">
        <span>Total a Pagar</span>
        <strong>{formatCurrency(totalAmount)}</strong>
      </div>

      <div className="field-group">
        <label>Forma de Pagamento</label>

        <div className="payment-options">
          {paymentOptions.map((option) => (
            <label key={option.value} className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === option.value}
                onChange={() => onPaymentMethodChange(option.value)}
              />
              <span>
                <i className={`bi ${option.icon}`} /> {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="amountReceived">Valor Recebido</label>
        <input
          id="amountReceived"
          type="number"
          min="0"
          step="0.01"
          disabled={!cashPayment}
          value={amountReceived}
          onChange={(event) => onAmountReceivedChange(event.target.value)}
          placeholder="0,00"
        />
      </div>

      <div className="quick-actions">
        <button type="button" onClick={onExactAmount} disabled={!cashPayment}>
          Exato
        </button>

        {quickAmounts.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onQuickAmount(value)}
            disabled={!cashPayment}
          >
            {formatCurrency(value)}
          </button>
        ))}
      </div>

      <div className="change-box">
        <span>Troco previsto</span>
        <strong>{formatCurrency(changeAmount)}</strong>
      </div>

      <button
        type="button"
        className="finalize-button"
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
      >
        <i className="bi bi-calculator" />{" "}
        {submitting ? "Finalizando..." : "Finalizar Venda"}
      </button>

      {message ? <p className="feedback success">{message}</p> : null}
      {error ? <p className="feedback error">{error}</p> : null}
      {!canSubmit && !submitting ? (
        <p className="helper-text">Adicione produtos ao carrinho para habilitar a venda.</p>
      ) : null}
    </section>
  );
}
