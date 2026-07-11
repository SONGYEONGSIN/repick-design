/**
 * Waypoint 대시보드 더미 데이터.
 * 전부 결정론적 정적 리터럴 — Math.random / Date.now 사용 금지.
 * "오늘" 기준점은 실제 시스템 시각과 무관한 픽션 데이터셋 앵커(TODAY_ISO)다.
 */

export const TODAY_ISO = "2026-07-13";

export type ProjectStatus = "on_track" | "at_risk" | "delayed";
export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";
export type ActivityType = "complete" | "comment" | "create" | "update";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  capacityPercent: number;
  tasksAssigned: number;
  projectIds: string[];
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  status: ProjectStatus;
  progress: number;
  tasksTotal: number;
  tasksDone: number;
  startDate: string;
  dueDate: string;
  memberIds: string[];
  priority: Priority;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  isMine: boolean;
}

export interface ActivityItem {
  id: string;
  actorId: string;
  projectId: string;
  action: string;
  target: string;
  time: string;
  type: ActivityType;
}

export const CURRENT_USER_ID = "m1";

export const members: Member[] = [
  {
    id: "m1",
    name: "오하늘",
    role: "디자인 리드",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 92,
    tasksAssigned: 11,
    projectIds: ["p1", "p3"],
  },
  {
    id: "m2",
    name: "김도윤",
    role: "프로덕트 매니저",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 108,
    tasksAssigned: 14,
    projectIds: ["p1", "p2", "p5"],
  },
  {
    id: "m3",
    name: "이서준",
    role: "프론트엔드",
    avatarUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 76,
    tasksAssigned: 9,
    projectIds: ["p1", "p3", "p6"],
  },
  {
    id: "m4",
    name: "박지민",
    role: "백엔드",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 121,
    tasksAssigned: 15,
    projectIds: ["p1", "p4"],
  },
  {
    id: "m5",
    name: "최민아",
    role: "QA",
    avatarUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 64,
    tasksAssigned: 7,
    projectIds: ["p2", "p5"],
  },
  {
    id: "m6",
    name: "정하윤",
    role: "백엔드",
    avatarUrl:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 95,
    tasksAssigned: 10,
    projectIds: ["p2", "p4"],
  },
  {
    id: "m7",
    name: "강태오",
    role: "콘텐츠 전략",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 58,
    tasksAssigned: 6,
    projectIds: ["p3", "p5", "p6"],
  },
  {
    id: "m8",
    name: "윤소이",
    role: "프로덕트 디자이너",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=facearea&facepad=2.5",
    capacityPercent: 87,
    tasksAssigned: 9,
    projectIds: ["p5", "p6"],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "모바일 앱 리뉴얼",
    ownerId: "m1",
    status: "on_track",
    progress: 68,
    tasksTotal: 42,
    tasksDone: 29,
    startDate: "2026-06-01",
    dueDate: "2026-07-31",
    memberIds: ["m1", "m2", "m3", "m4"],
    priority: "high",
  },
  {
    id: "p2",
    name: "결제 시스템 마이그레이션",
    ownerId: "m2",
    status: "at_risk",
    progress: 41,
    tasksTotal: 36,
    tasksDone: 15,
    startDate: "2026-06-15",
    dueDate: "2026-07-18",
    memberIds: ["m2", "m5", "m6"],
    priority: "high",
  },
  {
    id: "p3",
    name: "온보딩 퍼널 개선",
    ownerId: "m3",
    status: "on_track",
    progress: 82,
    tasksTotal: 24,
    tasksDone: 20,
    startDate: "2026-06-08",
    dueDate: "2026-07-25",
    memberIds: ["m1", "m3", "m7"],
    priority: "medium",
  },
  {
    id: "p4",
    name: "API v3 문서화",
    ownerId: "m4",
    status: "delayed",
    progress: 24,
    tasksTotal: 18,
    tasksDone: 4,
    startDate: "2026-06-22",
    dueDate: "2026-07-15",
    memberIds: ["m4", "m6"],
    priority: "medium",
  },
  {
    id: "p5",
    name: "고객 포털 베타",
    ownerId: "m5",
    status: "on_track",
    progress: 55,
    tasksTotal: 30,
    tasksDone: 17,
    startDate: "2026-07-01",
    dueDate: "2026-08-14",
    memberIds: ["m2", "m5", "m7", "m8"],
    priority: "low",
  },
  {
    id: "p6",
    name: "Q3 브랜드 리프레시",
    ownerId: "m7",
    status: "at_risk",
    progress: 33,
    tasksTotal: 20,
    tasksDone: 7,
    startDate: "2026-06-20",
    dueDate: "2026-08-05",
    memberIds: ["m3", "m7", "m8"],
    priority: "low",
  },
];

export const tasks: Task[] = [
  { id: "t1", title: "결제 위젯 QA 시나리오 작성", projectId: "p2", assigneeId: "m5", dueDate: "2026-07-13", priority: "high", status: "in_progress", isMine: false },
  { id: "t2", title: "API v3 엔드포인트 스펙 검토", projectId: "p4", assigneeId: "m4", dueDate: "2026-07-14", priority: "high", status: "todo", isMine: false },
  { id: "t3", title: "온보딩 3단계 카피 리라이트", projectId: "p3", assigneeId: "m7", dueDate: "2026-07-14", priority: "medium", status: "in_progress", isMine: false },
  { id: "t4", title: "결제 실패 알림 플로우 설계", projectId: "p2", assigneeId: "m2", dueDate: "2026-07-15", priority: "high", status: "todo", isMine: false },
  { id: "t5", title: "모바일 앱 다크모드 QA", projectId: "p1", assigneeId: "m3", dueDate: "2026-07-15", priority: "medium", status: "todo", isMine: false },
  { id: "t6", title: "고객 포털 로그인 화면 목업", projectId: "p5", assigneeId: "m8", dueDate: "2026-07-16", priority: "medium", status: "in_progress", isMine: false },
  { id: "t7", title: "브랜드 컬러 팔레트 최종안", projectId: "p6", assigneeId: "m8", dueDate: "2026-07-16", priority: "low", status: "todo", isMine: false },
  { id: "t8", title: "API v3 인증 문서 초안", projectId: "p4", assigneeId: "m6", dueDate: "2026-07-17", priority: "high", status: "todo", isMine: false },
  { id: "t9", title: "리뉴얼 아이콘 세트 정리", projectId: "p1", assigneeId: "m1", dueDate: "2026-07-13", priority: "high", status: "in_progress", isMine: true },
  { id: "t10", title: "온보딩 위젯 컴포넌트 리뷰", projectId: "p3", assigneeId: "m1", dueDate: "2026-07-14", priority: "medium", status: "todo", isMine: true },
  { id: "t11", title: "디자인 시스템 spacing 토큰 정리", projectId: "p1", assigneeId: "m1", dueDate: "2026-07-16", priority: "medium", status: "todo", isMine: true },
  { id: "t12", title: "프로토타입 사용성 테스트 취합", projectId: "p3", assigneeId: "m1", dueDate: "2026-07-18", priority: "low", status: "todo", isMine: true },
  { id: "t13", title: "리뉴얼 v2 목업 최종 검수", projectId: "p1", assigneeId: "m1", dueDate: "2026-07-11", priority: "high", status: "done", isMine: true },
  { id: "t14", title: "온보딩 카피 톤 가이드", projectId: "p3", assigneeId: "m1", dueDate: "2026-07-10", priority: "medium", status: "done", isMine: true },
  { id: "t15", title: "결제 마이그레이션 롤백 플랜", projectId: "p2", assigneeId: "m2", dueDate: "2026-07-20", priority: "medium", status: "todo", isMine: false },
  { id: "t16", title: "고객 포털 베타 초대 이메일", projectId: "p5", assigneeId: "m5", dueDate: "2026-07-22", priority: "low", status: "todo", isMine: false },
  { id: "t17", title: "브랜드 로고 반응형 가이드", projectId: "p6", assigneeId: "m7", dueDate: "2026-07-24", priority: "low", status: "in_progress", isMine: false },
  { id: "t18", title: "API v3 변경 로그 작성", projectId: "p4", assigneeId: "m4", dueDate: "2026-07-19", priority: "medium", status: "todo", isMine: false },
  { id: "t19", title: "모바일 앱 접근성 감사", projectId: "p1", assigneeId: "m3", dueDate: "2026-07-21", priority: "medium", status: "todo", isMine: false },
  { id: "t20", title: "온보딩 A/B 테스트 결과 분석", projectId: "p3", assigneeId: "m7", dueDate: "2026-07-25", priority: "low", status: "todo", isMine: false },
  { id: "t21", title: "결제 API 유닛 테스트", projectId: "p2", assigneeId: "m6", dueDate: "2026-07-09", priority: "medium", status: "done", isMine: false },
  { id: "t22", title: "고객 포털 와이어프레임", projectId: "p5", assigneeId: "m8", dueDate: "2026-07-08", priority: "medium", status: "done", isMine: false },
  { id: "t23", title: "브랜드 무드보드 확정", projectId: "p6", assigneeId: "m7", dueDate: "2026-07-07", priority: "low", status: "done", isMine: false },
  { id: "t24", title: "모바일 앱 QA 1차 라운드", projectId: "p1", assigneeId: "m3", dueDate: "2026-07-09", priority: "high", status: "done", isMine: false },
];

export const activities: ActivityItem[] = [
  { id: "a1", actorId: "m1", projectId: "p1", action: "완료 처리했습니다", target: "리뉴얼 v2 목업 최종 검수", time: "12분 전", type: "complete" },
  { id: "a2", actorId: "m4", projectId: "p4", action: "댓글을 남겼습니다", target: "API v3 엔드포인트 스펙 검토", time: "38분 전", type: "comment" },
  { id: "a3", actorId: "m2", projectId: "p2", action: "상태를 '주의 필요'로 변경했습니다", target: "결제 시스템 마이그레이션", time: "1시간 전", type: "update" },
  { id: "a4", actorId: "m8", projectId: "p5", action: "목업을 업로드했습니다", target: "고객 포털 로그인 화면", time: "2시간 전", type: "create" },
  { id: "a5", actorId: "m3", projectId: "p1", action: "완료 처리했습니다", target: "모바일 앱 QA 1차 라운드", time: "3시간 전", type: "complete" },
  { id: "a6", actorId: "m7", projectId: "p6", action: "댓글을 남겼습니다", target: "브랜드 컬러 팔레트 최종안", time: "4시간 전", type: "comment" },
  { id: "a7", actorId: "m6", projectId: "p2", action: "완료 처리했습니다", target: "결제 API 유닛 테스트", time: "어제", type: "complete" },
  { id: "a8", actorId: "m5", projectId: "p5", action: "새 작업을 추가했습니다", target: "고객 포털 베타 초대 이메일", time: "어제", type: "create" },
  { id: "a9", actorId: "m1", projectId: "p3", action: "완료 처리했습니다", target: "온보딩 카피 톤 가이드", time: "어제", type: "complete" },
  { id: "a10", actorId: "m2", projectId: "p2", action: "팀원을 추가했습니다", target: "정하윤 · 결제 시스템 마이그레이션", time: "2일 전", type: "update" },
];

export const statusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  on_track: { label: "정상 진행", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  at_risk: { label: "주의 필요", className: "bg-amber-50 text-amber-700 border-amber-200" },
  delayed: { label: "지연", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const priorityMeta: Record<Priority, { label: string; className: string }> = {
  high: { label: "높음", className: "bg-rose-50 text-rose-700 border-rose-200" },
  medium: { label: "보통", className: "bg-amber-50 text-amber-700 border-amber-200" },
  low: { label: "낮음", className: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

export const taskStatusMeta: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "할 일", className: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  in_progress: { label: "진행중", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  done: { label: "완료", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export function getMember(id: string): Member {
  const found = members.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown member id: ${id}`);
  return found;
}

export function getProject(id: string): Project {
  const found = projects.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown project id: ${id}`);
  return found;
}
