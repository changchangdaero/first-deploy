import AdminArchiveNav from '@/components/admin/AdminArchiveNav';
import { requireAdminAuthenticated } from '@/lib/admin-server-auth';
import { getAdminVisitorLogs, getTodayInSeoulDate } from '@/lib/visitors';
import type { VisitorClass, VisitorVisitLog } from '@/types/visitor';

const classLabels: Record<VisitorClass, string> = {
  human_likely: '사람 추정',
  bot: '봇',
  suspected_bot: '봇 의심',
  unknown: '판별 불가',
};

const classStyles: Record<VisitorClass, string> = {
  human_likely: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  bot: 'bg-rose-50 text-rose-700 border-rose-200',
  suspected_bot: 'bg-amber-50 text-amber-800 border-amber-200',
  unknown: 'bg-slate-50 text-slate-600 border-slate-200',
};

const reasonLabels: Record<string, string> = {
  user_agent_missing: 'User-Agent 없음',
  known_bot_user_agent: '알려진 봇 User-Agent',
  automation_user_agent: '자동화 도구 User-Agent',
  unrecognized_user_agent: '인식할 수 없는 User-Agent',
  normal_browser_user_agent: '일반 브라우저 User-Agent',
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

function getSummary(logs: VisitorVisitLog[]) {
  return logs.reduce(
    (summary, log) => {
      summary.total += 1;
      summary[log.visitor_class] += 1;
      if (log.is_returning) summary.returning += 1;
      return summary;
    },
    { total: 0, human_likely: 0, bot: 0, suspected_bot: 0, unknown: 0, returning: 0 }
  );
}

export default async function AdminVisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; classification?: string }>;
}) {
  await requireAdminAuthenticated();
  const params = await searchParams;
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(params.date ?? '')
    ? params.date!
    : getTodayInSeoulDate();
  const selectedClass = Object.hasOwn(classLabels, params.classification ?? '')
    ? (params.classification as VisitorClass)
    : '';
  const allLogs = await getAdminVisitorLogs();
  const logs = allLogs.filter(
    (log) =>
      log.visit_date === selectedDate &&
      (!selectedClass || log.visitor_class === selectedClass)
  );
  const summary = getSummary(allLogs.filter((log) => log.visit_date === selectedDate));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <AdminArchiveNav />

      <div className="mb-7">
        <h1 className="text-3xl font-bold text-[var(--text-heading)]">방문자 분석</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          유입 경로와 봇 판정은 관리자에게만 표시됩니다. 판정은 요청 정보를 기반으로 한 추정치입니다.
        </p>
      </div>

      <form className="mb-7 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
        <label className="grid gap-1 text-sm text-[var(--text-muted)]">
          날짜
          <input name="date" type="date" defaultValue={selectedDate} className="rounded-lg border border-[var(--border-default)] bg-transparent px-3 py-2 text-[var(--text-heading)]" />
        </label>
        <label className="grid gap-1 text-sm text-[var(--text-muted)]">
          판정
          <select name="classification" defaultValue={selectedClass} className="rounded-lg border border-[var(--border-default)] bg-[var(--portfolio-surface)] px-3 py-2 text-[var(--text-heading)]">
            <option value="">전체</option>
            {Object.entries(classLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button type="submit" className="rounded-lg bg-[var(--text-heading)] px-4 py-2 text-sm font-semibold text-[var(--portfolio-surface)]">조회</button>
      </form>

      <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-6">
        {[
          ['전체', summary.total],
          ['사람 추정', summary.human_likely],
          ['봇', summary.bot],
          ['봇 의심', summary.suspected_bot],
          ['판별 불가', summary.unknown],
          ['재방문', summary.returning],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)] p-4">
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--text-heading)]">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--portfolio-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-[var(--portfolio-surface-muted)] text-xs text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3">시각</th>
                <th className="px-4 py-3">판정</th>
                <th className="px-4 py-3">유입처</th>
                <th className="px-4 py-3">첫 진입 페이지</th>
                <th className="px-4 py-3">방문</th>
                <th className="px-4 py-3">기기</th>
                <th className="px-4 py-3">판정 근거</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)]">
              {logs.map((log) => (
                <tr key={`${log.visitor_id}-${log.visit_date}`} className="text-[var(--text-heading)]">
                  <td className="whitespace-nowrap px-4 py-3">{formatDateTime(log.last_visited_at)}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${classStyles[log.visitor_class]}`}>{classLabels[log.visitor_class]}</span></td>
                  <td className="px-4 py-3">
                    <div>{log.source_label}</div>
                    {log.utm_campaign && <div className="mt-1 text-xs text-[var(--text-muted)]">campaign: {log.utm_campaign}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{log.landing_path}</td>
                  <td className="px-4 py-3">{log.is_returning ? '재방문' : '신규'}</td>
                  <td className="px-4 py-3">{log.device_type}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{log.classification_reasons.map((reason) => reasonLabels[reason] ?? reason).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && <p className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">조건에 해당하는 방문 기록이 없습니다.</p>}
      </section>
    </main>
  );
}
