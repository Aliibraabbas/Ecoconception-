import { useEffect, useRef } from "react";
import { Chart, BarElement, LinearScale, CategoryScale, BarController, Tooltip } from "chart.js";

Chart.register(BarElement, LinearScale, CategoryScale, BarController, Tooltip);

const LABELS = { low: "Basse", medium: "Moyenne", high: "Haute" };

export default function PriorityBar({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => LABELS[d.priority] || d.priority),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: ["#64748B", "#F59E0B", "#EF4444"],
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div>
      <canvas ref={canvasRef} role="img" aria-label="Tâches actives par priorité" height="220" />
      <table className="sr-only">
        <caption>Tâches actives par priorité</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.priority}>
              <td>{LABELS[d.priority] || d.priority}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
