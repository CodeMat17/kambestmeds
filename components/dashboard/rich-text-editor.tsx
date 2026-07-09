"use client";

import type { ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ToolbarButton({
  pressed,
  onClick,
  label,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(pressed && "bg-muted text-foreground")}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto", "tel"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "richtext min-h-[220px] rounded-md border border-input bg-background px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-muted/40 p-1">
        <ToolbarButton
          pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Bold"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Italic"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          label="Heading"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Bullet list"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Numbered list"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("link")}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            const url = window.prompt("Link URL");
            if (!url) return;
            editor.chain().focus().setLink({ href: url }).run();
          }}
          label="Link"
        >
          {editor.isActive("link") ? (
            <Unlink className="size-4" />
          ) : (
            <LinkIcon className="size-4" />
          )}
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
