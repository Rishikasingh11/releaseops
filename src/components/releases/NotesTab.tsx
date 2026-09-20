import { useState } from "react";
import type { ReleaseNote } from "../../types";
import { Card } from "../common/Card";
import { formatDateTime } from "../../utils/format";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";

interface NotesTabProps {
  releaseId: string;
  notes: ReleaseNote[];
}

export function NotesTab({ releaseId, notes }: NotesTabProps) {
  const currentUser = useAppStore((state) => state.currentUser);
  const addReleaseNote = useAppStore((state) => state.addReleaseNote);
  const showToast = useToastStore((state) => state.showToast);
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    if (!draft.trim()) return;
    addReleaseNote(releaseId, currentUser.name, draft.trim());
    showToast({ variant: "success", title: "Note added" });
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a note about this release..."
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!draft.trim()}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            Add Note
          </button>
        </div>
      </Card>

      {notes.map((note, index) => (
        <Card key={note.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{note.author}</p>
            <p className="text-xs text-slate-400">{formatDateTime(note.timestamp)}</p>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{note.content}</p>
        </Card>
      ))}
      {notes.length === 0 && (
        <p className="text-sm text-slate-400">No notes yet.</p>
      )}
    </div>
  );
}
