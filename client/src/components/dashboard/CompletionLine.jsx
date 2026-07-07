import { useEffect, useRef } from "react";
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, LineController, Tooltip, Filler } from "chart.js";

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, LineController, Tooltip, Filler);

export default function CompletionLine({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })),
        datasets: [
          {
            label: "Tâches terminées",
            data: data.map((d) => d.count),
            borderColor: "#6366F1",
            backgroundColor: "rgba(99,102,241,0.15)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div>
      <canvas ref={canvasRef} role="img" aria-label="Complétion des tâches sur 30 jours" height="220" />
      <table className="sr-only">
        <caption>Tâches terminées par jour (30 derniers jours)</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
