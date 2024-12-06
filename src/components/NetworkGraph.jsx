import { Card } from "@/components/ui/card";

const NetworkGraph = ({ nodes, edges, onNodeClick }) => {
  return (
    <Card className="p-4 w-full h-[400px] relative">
      <svg className="w-full h-full">
        {/* Draw edges */}
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#60A5FA"
                strokeWidth="2"
              />
              <text
                x={(fromNode.x + toNode.x) / 2}
                y={(fromNode.y + toNode.y) / 2}
                fill="#1E293B"
                className="text-sm"
              >
                {edge.cost}
              </text>
            </g>
          );
        })}
        {/* Draw nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x},${node.y})`}
            onClick={() => onNodeClick?.(node.id)}
            className="cursor-pointer"
          >
            <circle
              r="20"
              fill="#1E40AF"
              className="transition-all hover:r-[22]"
            />
            <text
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-sm font-bold"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </Card>
  );
};

export default NetworkGraph;

