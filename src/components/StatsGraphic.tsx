import { Chart, registerables } from "chart.js";
import { Pokemon } from "../lib/dataClasses/pokemon";
import { useEffect, useRef, useState } from "react";
import { typesMap } from "../lib/constants";
import { Canvas } from "./Canvas";

Chart.defaults.color = "#bebebe";
Chart.defaults.borderColor = "#5f6366";

export function StatsGraphic({ pokemon }: { pokemon: Pokemon }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<Chart<"radar", number[], string>>();

  useEffect(() => {
    const ctx = chartRef.current!.getContext("2d");
    if (ctx === null) return;
    if (chart) chart.destroy();

    const stats = pokemon.getStats();
    const dataStats = [
      { stat: "Attack", count: stats.attack },
      { stat: "Defense", count: stats.defense },
      { stat: "Speed", count: stats.speed },
      { stat: "Sp Attack", count: stats.spAttack },
      { stat: "Sp Defense", count: stats.spDefense },
      { stat: "Health", count: stats.hp },
    ];

    const data = {
      labels: dataStats.map((item) => item.stat),
      datasets: [
        {
          label: "Stats",
          data: dataStats.map((item) => item.count),
          borderColor: typesMap[pokemon.types.primary].color,
          backgroundColor: typesMap[pokemon.types.primary].color.replace(
            "1)",
            "0.7)"
          ),
        },
      ],
    };

    const options = {
      plugins: {
        legend: { display: false },
      },
      scales: {
        r: {
          ticks: { display: false },
          beginAtZero: true,
          max: pokemon.level * 5, // Maximos de los ejes segun el nivel del pokemon?
        },
      },
      // animation: false // FIXME: Esto da error mas abajo. Deberia ser false
    };

    Chart.register(...registerables);
    const newChart = new Chart(ctx, { type: "radar", data, options });
    setChart(newChart);

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [pokemon]);

  return <Canvas width={0} height={0} canvasRef={chartRef} className="" />;
}
