'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, Code, List, ListOrdered,
  Heading2, Heading3, Link as LinkIcon, Quote, Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface Props {
  content: string
  onChange: (content: string) => void
  editable?: boolean
}

export default function NoteEditor({ content, onChange, editable = true }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Начните писать... (поддерживаются #хэштеги)' }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap-editor ProseMirror focus:outline-none' },
    },
  })

  // Sync content when note changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!editor) return null

  const ToolbarBtn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={cn(
        'p-1.5 rounded transition-colors',
        active
          ? 'bg-violet-600/30 text-violet-400'
          : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="tiptap-editor border border-[#30363d] rounded-xl overflow-hidden">
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[#30363d] bg-[#161b22]">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
            <Bold size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
            <Italic size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code">
            <Code size={14} />
          </ToolbarBtn>
          <div className="w-px h-4 bg-gray-700 mx-1" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
            <Heading2 size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
            <Heading3 size={14} />
          </ToolbarBtn>
          <div className="w-px h-4 bg-gray-700 mx-1" />
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
            <List size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
            <ListOrdered size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
            <Quote size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
            <Minus size={14} />
          </ToolbarBtn>
        </div>
      )}
      <div className="p-4 min-h-[400px] bg-[#0d1117]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
