import { useEffect, useState } from "react";

import { fetchHistory } from "../api/pdvApi.js";
import { HistoryList } from "../components/history/HistoryList.jsx";

export function HistoryPage() {
  // Estado simples para carregar e exibir o historico consolidado.
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await fetchHistory();
        setSales(data);
      } catch (requestError) {
        setError(requestError.response?.data?.message ?? "Nao foi possivel carregar o historico.");
      } finally {
        setLoading(false);
      }
    }

    // O historico e buscado uma vez ao abrir a pagina.
    loadHistory();
  }, []);

  return (
    <section className="history-grid">
      <HistoryList sales={sales} loading={loading} error={error} />
    </section>
  );
}
