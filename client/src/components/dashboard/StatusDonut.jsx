import { useEffect, useRef } from "react";
import { Chart, ArcElement, DoughnutController, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

const LABELS = { todo: "À faire", in_progress: "En cours", done: "Terminé" };

export default function StatusDonut({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: data.map((d) => LABELS[d.status] || d.status),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: ["#64748B", "#F59E0B", "#10B981"],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div>
      <canvas ref={canvasRef} role="img" aria-label="Répartition des tâches par statut" height="220" />
      <table className="sr-only">
        <caption>Répartition des tâches par statut</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.status}>
              <td>{LABELS[d.status] || d.status}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
