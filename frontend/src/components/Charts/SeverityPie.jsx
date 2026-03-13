// src/components/Charts/SeverityPie.jsx
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00"];

export default function SeverityPie({ data }) {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" nameKey="severity" cx="50%" cy="50%" outerRadius={100}>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}