'use client';

import { EditorContent, Mark, mergeAttributes, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, List, ListOrdered } from 'lucide-react';
import { useState } from 'react';
import { projectTextHtml, storeRichProjectText } from '@/src/lib/projectText';

const Highlight = Mark.create({
    name: 'highlight',
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    parseHTML() {
        return [
            { tag: 'mark' },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['mark', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addKeyboardShortcuts() {
        return {
            'Mod-Shift-h': () => this.editor.commands.toggleMark(this.name),
            'Mod-Shift-H': () => this.editor.commands.toggleMark(this.name),
        };
    },
});

const extensions = [
    StarterKit.configure({
        link: { openOnClick: false, autolink: false, linkOnPaste: false },
        trailingNode: false,
    }),
    UnderlineExtension,
    Highlight,
];

const marks = [
    { name: 'bold', label: 'Bold', shortcut: 'Ctrl+B Meta+B', icon: Bold },
    { name: 'italic', label: 'Italic', shortcut: 'Ctrl+I Meta+I', icon: Italic },
    { name: 'underline', label: 'Underline', shortcut: 'Ctrl+U Meta+U', icon: UnderlineIcon },
    { name: 'highlight', label: 'Highlight text', shortcut: 'Ctrl+Shift+H Meta+Shift+H', icon: Highlighter },
] as const;

interface ProjectTextEditorProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string, plainText: string) => void;
    minHeight: string;
    placeholder?: string;
    allowLegacyHtml?: boolean;
    required?: boolean;
    error?: string;
}

export default function ProjectTextEditor({
    id, label, value, onChange, minHeight, placeholder, allowLegacyHtml, required, error,
}: ProjectTextEditorProps) {
    const [initialContent] = useState(() => projectTextHtml(value, allowLegacyHtml));
    const editor = useEditor({
        extensions,
        content: initialContent,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                id,
                class: `project-text ${minHeight} px-3 py-2 outline-none`,
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-labelledby': `${id}-label`,
                ...(required && { 'aria-required': 'true' }),
                ...(error && { 'aria-invalid': 'true', 'aria-describedby': `${id}-error` }),
            },
        },
        onUpdate: ({ editor }) => {
            const plainText = editor.getText();
            const firstBlock = editor.state.doc.firstChild;
            const firstText = firstBlock?.firstChild;
            const isPlain = editor.state.doc.childCount === 1 && firstBlock?.type.name === 'paragraph'
                && firstBlock.childCount === 1 && firstText?.isText && firstText.marks.length === 0;

            onChange(editor.isEmpty ? '' : isPlain ? plainText : storeRichProjectText(editor.getHTML()), plainText);
        },
    });

    const state = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) return null;

            const level = editor.isActive('heading') ? Number(editor.getAttributes('heading').level) : 0;
            return {
                block: level === 0 ? 'text' : level <= 3 ? 'title' : 'subtitle',
                bold: editor.isActive('bold'),
                italic: editor.isActive('italic'),
                underline: editor.isActive('underline'),
                highlight: editor.isActive('highlight'),
                bulletList: editor.isActive('bulletList'),
                orderedList: editor.isActive('orderedList'),
                isEmpty: editor.isEmpty,
            };
        },
    });

    return (
        <div>
            <div id={`${id}-label`} className="mb-1 text-sm font-medium text-[#CCCCCC]">
                {label}
            </div>
            <div className="overflow-hidden rounded-lg border border-[#333333] bg-[#141414] text-sm text-white focus-within:border-[#6DD33D]">
                <div role="group" aria-label={`${label} formatting`} className="flex flex-wrap items-center gap-1 border-b border-[#333333] bg-[#1a1a1a] p-1.5">
                    <select
                        aria-label={`${label} text style`}
                        value={state?.block ?? 'text'}
                        disabled={!editor}
                        onChange={(event) => {
                            const style = event.target.value;
                            const chain = editor?.chain().focus();
                            if (style === 'text') chain?.setParagraph().run();
                            else chain?.setHeading({ level: style === 'title' ? 3 : 4 }).run();
                        }}
                        className="mr-1 rounded border border-[#444444] bg-[#141414] px-2 py-1.5 text-xs text-white focus-visible:outline-2 focus-visible:outline-[#6DD33D]"
                    >
                        <option value="text">Text Description</option>
                        <option value="title">Title</option>
                        <option value="subtitle">Subtitle</option>
                    </select>
                    <div className="mx-0.5 h-4 w-px bg-[#333333]" />
                    {marks.map(({ name, label, shortcut, icon: Icon }) => (
                        <button
                            key={name}
                            type="button"
                            title={label}
                            aria-label={label}
                            aria-keyshortcuts={shortcut}
                            aria-pressed={state?.[name] ?? false}
                            disabled={!editor}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => editor?.chain().focus().toggleMark(name).run()}
                            className="rounded p-2 text-[#CCCCCC] hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-[#6DD33D] aria-pressed:bg-[#6DD33D]/15 aria-pressed:text-[#8BE65E]"
                        >
                            <Icon aria-hidden="true" className="h-4 w-4" />
                        </button>
                    ))}
                    <div className="mx-0.5 h-4 w-px bg-[#333333]" />
                    <button
                        type="button"
                        title="Bullet list"
                        aria-label="Bullet list"
                        aria-pressed={state?.bulletList ?? false}
                        disabled={!editor}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        className="rounded p-2 text-[#CCCCCC] hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-[#6DD33D] aria-pressed:bg-[#6DD33D]/15 aria-pressed:text-[#8BE65E]"
                    >
                        <List aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        title="Numbered list (1, 2, 3)"
                        aria-label="Numbered list (1, 2, 3)"
                        aria-pressed={state?.orderedList ?? false}
                        disabled={!editor}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        className="rounded p-2 text-[#CCCCCC] hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-[#6DD33D] aria-pressed:bg-[#6DD33D]/15 aria-pressed:text-[#8BE65E]"
                    >
                        <ListOrdered aria-hidden="true" className="h-4 w-4" />
                    </button>
                </div>
                <div className={`relative ${minHeight}`}>
                    {placeholder && state?.isEmpty && (
                        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-2 text-[#888888]">{placeholder}</span>
                    )}
                    <EditorContent editor={editor} />
                </div>
            </div>
            {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}
