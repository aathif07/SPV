"use client";

import { useState, useTransition } from "react";

/**
 * Two-step delete. Deliberately not window.confirm — an inline confirmation
 * keeps the interaction inside the page.
 */
export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function remove() {
    setError(null);
    const response = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete. Please try again.");
      setArmed(false);
      return;
    }
    startTransition(() => window.location.reload());
  }

  if (!armed) {
    return (
      <>
        <button
          type="button"
          className="admin-link-danger"
          onClick={() => setArmed(true)}
          aria-label={`Delete ${title}`}
        >
          Delete
        </button>
        {error ? <span className="admin-inline-error">{error}</span> : null}
      </>
    );
  }

  return (
    <span className="admin-confirm">
      Delete?
      <button type="button" className="admin-link-danger" disabled={pending} onClick={remove}>
        {pending ? "Deleting…" : "Yes"}
      </button>
      <button type="button" className="admin-link" onClick={() => setArmed(false)}>
        No
      </button>
    </span>
  );
}
