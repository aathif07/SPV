"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef } from "react";

export type UploadImage = (file: File) => Promise<string | null>;

function ToolbarButton({
  editor,
  label,
  title,
  isActive,
  onClick,
  disabled,
}: {
  editor: Editor;
  label: string;
  title: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  void editor;
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={isActive ? "is-active" : ""}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  uploadImage,
  ariaLabel,
  lang,
}: {
  value: string;
  onChange: (html: string) => void;
  uploadImage?: UploadImage;
  ariaLabel: string;
  lang?: string;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    // The document is rendered on the server first; let the client mount it.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true },
      }),
      Image.configure({ inline: false, allowBase64: false }),
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

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    // A small inline prompt would be nicer, but window.prompt keeps this
    // dependency-free and the admin surface is not public.
    const href = window.prompt("Link URL", previous ?? "https://");
    if (href === null) return;
    if (href.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  async function pickImage(file: File | undefined) {
    if (!file || !uploadImage || !editor) return;
    const url = await uploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="editor">
      <div className="editor-toolbar" role="toolbar" aria-label={`${ariaLabel} formatting`}>
        <ToolbarButton editor={editor} label="B" title="Bold" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton editor={editor} label="I" title="Italic" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton editor={editor} label="U" title="Underline" isActive={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <span className="editor-sep" />
        <ToolbarButton editor={editor} label="H2" title="Heading 2" isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton editor={editor} label="H3" title="Heading 3" isActive={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <span className="editor-sep" />
        <ToolbarButton editor={editor} label="• List" title="Bullet list" isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton editor={editor} label="1. List" title="Numbered list" isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton editor={editor} label="❝" title="Quote" isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <span className="editor-sep" />
        <ToolbarButton editor={editor} label="Link" title="Add or edit link" isActive={editor.isActive("link")} onClick={setLink} />
        <span className="editor-sep" />
        <ToolbarButton editor={editor} label="↶" title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
        <ToolbarButton editor={editor} label="↷" title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
      </div>

      <EditorContent editor={editor} />

      {uploadImage ? (
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            void pickImage(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      ) : null}
    </div>
  );
}
