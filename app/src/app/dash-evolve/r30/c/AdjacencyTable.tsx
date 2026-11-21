"use client";

import { EDGES, NODE_BY_ID, STATUS_META } from "./data";

/**
 * Screen-reader-only accessible fallback for the graph's edges. The visible sortable table below
 * the graph covers every node's own metrics; this table separately covers the relationships
 * between them (an adjacency list), which the SVG conveys only visually. `sr-only` is applied to
 * the wrapping div, never to the `<table>` element itself.
 */
export default function AdjacencyTable() {
  return (
    <div className="sr-only">
      <table>
        <caption>
          Dependency relationships between services: which service calls which, and the health status of that
          connection.
        </caption>
        <thead>
          <tr>
            <th scope="col">Caller</th>
            <th scope="col">Callee</th>
            <th scope="col">Connection status</th>
            <th scope="col">Approximate throughput</th>
          </tr>
        </thead>
        <tbody>
          {EDGES.map((edge) => {
            const from = NODE_BY_ID.get(edge.from)!;
            const to = NODE_BY_ID.get(edge.to)!;
            return (
              <tr key={edge.id}>
                <td>{from.fullName}</td>
                <td>{to.fullName}</td>
                <td>{STATUS_META[edge.status].label}</td>
                <td>{edge.weightRps} requests per second</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
