import React from 'react';
import { interpolate } from 'remotion';
import { COLORS } from '../colors';

type Node = { x: number; y: number; r: number };
type Edge = { from: number; to: number };

type NodeNetworkProps = {
  frame: number;
  width: number;
  height: number;
  nodes?: Node[];
  edges?: Edge[];
  color?: string;
  animated?: boolean;
};

const DEFAULT_NODES: Node[] = [
  { x: 50, y: 50, r: 5 },
  { x: 200, y: 30, r: 4 },
  { x: 350, y: 80, r: 6 },
  { x: 120, y: 150, r: 3 },
  { x: 270, y: 160, r: 5 },
  { x: 420, y: 140, r: 4 },
  { x: 60, y: 260, r: 4 },
  { x: 190, y: 240, r: 6 },
  { x: 340, y: 250, r: 3 },
  { x: 480, y: 200, r: 5 },
  { x: 560, y: 120, r: 4 },
  { x: 500, y: 280, r: 3 },
];

const DEFAULT_EDGES: Edge[] = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 3 },
  { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 2, to: 5 },
  { from: 3, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 8 },
  { from: 4, to: 7 }, { from: 5, to: 9 }, { from: 9, to: 10 },
  { from: 10, to: 2 }, { from: 9, to: 11 }, { from: 8, to: 11 },
  { from: 1, to: 4 }, { from: 2, to: 9 },
];

export const NodeNetwork: React.FC<NodeNetworkProps> = ({
  frame,
  width,
  height,
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  color = COLORS.cyan,
  animated = true,
}) => {
  const globalOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((edge, i) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        if (!fromNode || !toNode) return null;

        const edgeProgress = interpolate(
          frame,
          [i * 1.5, i * 1.5 + 25],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const len = Math.sqrt(dx * dx + dy * dy);

        // Animated pulse along edge
        const pulsePos = animated
          ? ((frame * 0.8 + i * 30) % 100) / 100
          : 0.5;

        const px = fromNode.x + dx * pulsePos;
        const py = fromNode.y + dy * pulsePos;

        return (
          <g key={i} opacity={edgeProgress * globalOpacity}>
            <line
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={color}
              strokeWidth={0.5}
              strokeOpacity={0.25}
            />
            {animated && (
              <circle
                cx={px}
                cy={py}
                r={1.5}
                fill={color}
                opacity={0.7}
                filter="url(#glow)"
              />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const nodeProgress = interpolate(
          frame,
          [i * 2, i * 2 + 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const pulse = animated
          ? 1 + 0.3 * Math.sin((frame / 30) * 2 + i)
          : 1;

        return (
          <g key={i} opacity={nodeProgress * globalOpacity}>
            {/* Outer glow ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 2.5 * pulse}
              fill={color}
              fillOpacity={0.05}
            />
            {/* Inner node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={color}
              fillOpacity={0.7}
              filter="url(#glow)"
            />
            {/* Core */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r * 0.5}
              fill={COLORS.white}
              fillOpacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
};
