import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Rocket,
  Plus,
  Trash2,
} from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { FreezeWindowModal } from "./FreezeWindowModal";
import { releaseStatusStyles } from "../../utils/statusStyles";
import { ROUTES } from "../../routes/paths";

export function ReleaseCalendar() {
  const releases = useAppStore((state) => state.releases);
  const freezeWindows = useAppStore((state) => state.freezeWindows);
  const toggleFreezeWindow = useAppStore((state) => state.toggleFreezeWindow);
  const deleteFreezeWindow = useAppStore((state) => state.deleteFreezeWindow);

  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  // Default to September 2026 (matching release seed data)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 is September (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(20);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  const getReleasesForDay = (day: number) => {
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    return releases.filter((r) => r.targetDate === dateStr);
  };

  const getFreezeForDay = (day: number) => {
    const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    const target = new Date(dateStr).getTime();
    return freezeWindows.filter((w) => {
      const start = new Date(w.startDate).getTime();
      const end = new Date(`${w.endDate}T23:59:59Z`).getTime();
      return target >= start && target <= end;
    });
  };

  const selectedDateStr = selectedDay
    ? `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDay)}`
    : null;
  const selectedReleases = selectedDay ? getReleasesForDay(selectedDay) : [];
  const selectedFreezes = selectedDay ? getFreezeForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled Releases</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{releases.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Change Freezes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {freezeWindows.filter((f) => f.enforced).length}
            </p>
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Governance Policy</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Change Freezes Enforced</p>
            <p className="text-xs text-slate-500">Auto-blocks production gates</p>
          </div>
          <button
            type="button"
            onClick={() => setIsFreezeModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Freeze
          </button>
        </Card>
      </div>

      {/* Main Calendar Grid & Day Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Grid (2 cols) */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 pt-4 text-center text-xs font-semibold text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid cells */}
          <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-lg bg-slate-50/40 dark:bg-slate-800/30" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayReleases = getReleasesForDay(day);
              const dayFreezes = getFreezeForDay(day);
              const isSelected = selectedDay === day;
              const hasFreeze = dayFreezes.some((f) => f.enforced);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex h-20 flex-col justify-between overflow-hidden rounded-xl border p-1.5 text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-900/30"
                      : hasFreeze
                        ? "border-red-200 bg-red-50/20 hover:bg-red-50/40 dark:border-red-900/40 dark:bg-red-900/10"
                        : "border-slate-100 bg-white hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {day}
                    </span>
                    {hasFreeze && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" title="Change Freeze Active" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayFreezes.length > 0 && (
                      <div className="truncate rounded bg-red-100/80 px-1 py-0.5 text-[9px] font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        ❄️ Freeze
                      </div>
                    )}
                    {dayReleases.slice(0, 2).map((r) => (
                      <div
                        key={r.id}
                        className="truncate rounded bg-blue-100/80 px-1 py-0.5 text-[9px] font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                      >
                        {r.name}
                      </div>
                    ))}
                    {dayReleases.length > 2 && (
                      <span className="text-[9px] text-slate-400">+{dayReleases.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected Day Inspector & Freeze Windows (1 col) */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedDateStr ? `Schedule for ${selectedDateStr}` : "Select a date"}
              </h3>
              {selectedDay && (
                <span className="text-xs text-slate-400">Day {selectedDay}</span>
              )}
            </div>

            {selectedFreezes.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Active Freeze Restrictions
                </p>
                {selectedFreezes.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-lg border border-red-200 bg-red-50/50 p-2.5 text-xs dark:border-red-900/50 dark:bg-red-900/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-red-900 dark:text-red-200">{f.name}</span>
                      <span className="rounded bg-red-200 px-1.5 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-800 dark:text-red-200">
                        {f.environment}
                      </span>
                    </div>
                    <p className="mt-1 text-red-700 dark:text-red-300">{f.reason}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Releases on this date ({selectedReleases.length})
              </p>
              {selectedReleases.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No releases scheduled for this day.</p>
              ) : (
                selectedReleases.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 p-3 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        to={ROUTES.releaseDetailPath(r.id)}
                        className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {r.name}
                      </Link>
                      <Badge className={releaseStatusStyles[r.status]}>{r.status}</Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Version {r.version} · {r.environment} · {r.releaseManager}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Change Freeze Management Panel */}
          <Card>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Configured Freeze Windows
                </h3>
                <p className="text-xs text-slate-500">Governs release gating</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFreezeModalOpen(true)}
                className="rounded-lg border border-slate-200 p-1 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                title="Add Freeze Window"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {freezeWindows.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start justify-between rounded-lg border border-slate-100 p-2.5 text-xs dark:border-slate-700/60 dark:bg-slate-800/40"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{f.name}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {f.environment}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {f.startDate} to {f.endDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFreezeWindow(f.id)}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                        f.enforced
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {f.enforced ? "Enforced" : "Disabled"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFreezeWindow(f.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <FreezeWindowModal isOpen={isFreezeModalOpen} onClose={() => setIsFreezeModalOpen(false)} />
    </div>
  );
}
