/**
 * Pulse — 고객 지원 SLA 운영 콘솔 타입 정의.
 */

export type Channel = "email" | "chat" | "phone" | "social";
export type ChannelFilter = "all" | Channel;
export type Period = "24h" | "7d" | "30d";
export type Priority = "urgent" | "high" | "normal" | "low";
export type AgentStatus = "available" | "busy" | "away" | "offline";

export interface QueueTicket {
  id: string;
  subject: string;
  channel: Channel;
  waitMinutes: number;
  priority: Priority;
  requester: string;
}

export interface EscalationTicket {
  id: string;
  subject: string;
  channel: Channel;
  reason: string;
  assigneeId: string;
  ageMinutes: number;
  priority: Priority;
}

export interface Agent {
  id: string;
  name: string;
  team: string;
  primaryChannel: Channel;
  activeTickets: number;
  capacity: number;
  status: AgentStatus;
  csat: number;
}

export interface CoverageShift {
  shift: string;
  hours: string;
  agents: number;
  utilizationPct: number;
}

export interface PeriodStat {
  label: string;
  shortLabel: string;
  totalHandled: number;
  channelHandled: Record<Channel, number>;
  avgResponseSeconds: number;
  resolutionRatePct: number;
  sparkline: number[];
  sparklineLabels: string[];
  slaByPriority: { priority: Priority; within: number; atRisk: number; breached: number }[];
  automationDeflectionPct: number;
  automationSparkline: number[];
  csatScore: number;
  csatSparkline: number[];
}

export type SortDirection = "asc" | "desc";
