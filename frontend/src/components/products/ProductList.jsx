import { formatCurrency } from "../../hooks/useCurrency.js";

export function ProductList({ products, loading, onAdd, search, onSearchChange }) {
  return (
    <section className="panel panel-products">
      <div className="panel-header">
        <h2>
          <i className="bi bi-box-seam" /> Produtos
        </h2>
      </div>

      <div className="search-field">
        <i className="bi bi-search" />
        <input
          type="text"
          value={search}
          // Mantem o campo controlado para sincronizar com a busca debounced da pagina.
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar produto (nome, codigo de barras ou categoria)"
        />
      </div>

      <div className="product-list">
        {loading ? <p className="empty-state small">Carregando produtos...</p> : null}

        {!loading && products.length === 0 ? (
          <p className="empty-state small">Nenhum produto encontrado.</p>
        ) : null}

        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div>
              <h3>{product.name}</h3>
              <p className="meta-row">
                <span className="chip">{product.category}</span>
                <span>Estoque: {product.stock}</span>
              </p>
              <strong>{formatCurrency(product.price)}</strong>
            </div>

            <button
              type="button"
              className="icon-button"
              // Ao clicar, delega a inclusao do item para a pagina dona do estado do carrinho.
              onClick={() => onAdd(product)}
              aria-label={`Adicionar ${product.name}`}
            >
              <i className="bi bi-plus-lg" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
