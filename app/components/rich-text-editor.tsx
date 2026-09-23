"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({
  value,
  onChange,
  ariaLabel,
  lang,
}: {
  value: string;
  onChange: (html: string) => void;
  ariaLabel: string;
  lang?: string;
}) {
  const editor = useEditor({
    // The document is rendered on the server first; let the client mount it.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "editor-surface",
        "aria-label": ariaLabel,
        ...(lang ? { lang } : {}),
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  if (!editor) return <div className="editor-loading">Loading editor…</div>;

  return (
    <div className="editor">
      <EditorContent editor={editor} />
    </div>
  );
}
