'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase/client';
import MultiImageUploader from './MultiImageUploader';
import ProjectTextEditor from './ProjectTextEditor';
import TagInput from './TagInput';
import { Loader2, Save } from 'lucide-react';
import { getProjectCategory, PROJECT_CATEGORIES } from '@/src/lib/projectCategories';
import { plainProjectTitle } from '@/src/lib/projectText';
import { Project } from '@/src/types/project';

interface ProjectFormProps {
    initialData?: Project;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [slugEdited, setSlugEdited] = useState(false);
    const [availableTechStacks, setAvailableTechStacks] = useState<{ id: string; name: string; icon_url: string }[]>([]);

    useEffect(() => {
        const fetchStacks = async () => {
            const { data } = await supabase.from('tech_stacks').select('id, name, icon_url').order('name');
            if (data) setAvailableTechStacks(data);
        };
        fetchStacks();
    }, []);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        duration: initialData?.duration || '',
        short_description: initialData?.short_description || '',
        long_description: initialData?.long_description || '',
        background: initialData?.background || '',
        implementation: initialData?.implementation || '',
        struggle: initialData?.struggle || '',
        images: initialData?.images || [], // Array of URLs
        tech_stack: initialData?.tech_stack || [],
        repo_link: initialData?.repo_link || '',
        demo_link: initialData?.demo_link || '',
        category: getProjectCategory(initialData?.category),
        is_featured: initialData?.is_featured || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const { name } = e.target;
        if (name === 'slug') setSlugEdited(true);
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleTitleChange = (title: string, plainText: string) => {
        if (plainText.trim()) setTitleError('');
        const generatedSlug = plainText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setFormData((current) => ({
            ...current,
            title,
            slug: initialData || slugEdited ? current.slug : generatedSlug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plainProjectTitle(formData.title).trim()) {
            setTitleError('Enter a project title.');
            document.getElementById('project-title')?.focus();
            return;
        }
        setLoading(true);

        try {
            let error;
            if (initialData) {
                const { error: updateError } = await supabase
                    .from('projects')
                    .update(formData)
                    .eq('id', initialData.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('projects')
                    .insert([formData]);
                error = insertError;
            }

            if (error) throw error;

            router.push('/admin/projects');
            router.refresh();
        } catch (error) {
            const message = error && typeof error === 'object' && 'message' in error ? error.message : error;
            alert('Error saving project: ' + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] p-6 shadow-xl">
            <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <ProjectTextEditor
                        id="project-title"
                        label="Title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        minHeight="min-h-9"
                        required
                        error={titleError}
                    />

                    <div>
                        <label htmlFor="project-slug" className="mb-1 block text-sm font-medium text-[#CCCCCC]">Slug</label>
                        <input
                            id="project-slug"
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2 text-sm text-white focus:border-[#6DD33D] focus:outline-none focus:ring-1 focus:ring-[#6DD33D]"
                        />
                    </div>

                    <div>
                        <label htmlFor="project-category" className="mb-1 block text-sm font-medium text-[#CCCCCC]">Category</label>
                        <select
                            id="project-category"
                            name="category"
                            value={formData.category}
                            onChange={(event) => {
                                const category = getProjectCategory(event.target.value);
                                setFormData((current) => ({ ...current, category }));
                            }}
                            className="w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2 text-sm text-white focus:border-[#6DD33D] focus:outline-none focus:ring-1 focus:ring-[#6DD33D]"
                        >
                            {PROJECT_CATEGORIES.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="project-duration" className="mb-1 block text-sm font-medium text-[#CCCCCC]">Duration</label>
                        <input
                            id="project-duration"
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g. 3 Months (Jan - Mar 2026)"
                            className="w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2 text-sm text-white focus:border-[#6DD33D] focus:outline-none focus:ring-1 focus:ring-[#6DD33D]"
                        />
                    </div>

                    <ProjectTextEditor
                        id="project-short-description"
                        label="Short Description"
                        value={formData.short_description}
                        onChange={(short_description) => setFormData((current) => ({ ...current, short_description }))}
                        minHeight="min-h-24"
                        placeholder="Brief summary for cards..."
                    />
                </div>

                {/* Right Column: Media, Links, Tech */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_featured"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-[#333333] bg-[#141414] text-[#6DD33D] focus:ring-[#6DD33D]"
                        />
                        <label htmlFor="is_featured" className="text-sm font-medium text-[#CCCCCC]">Feature this project?</label>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#CCCCCC]">Project Gallery (Multi-upload)</label>
                        <MultiImageUploader
                            defaultImages={formData.images}
                            onUpload={(images) => setFormData((current) => ({ ...current, images }))}
                        />
                        <p className="mt-1 text-xs text-[#666666]">First image will be used as a thumbnail if needed.</p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-[#CCCCCC]">Tech Stack</label>
                        <TagInput
                            value={formData.tech_stack || []}
                            onChange={(tech_stack) => setFormData((current) => ({ ...current, tech_stack }))}
                            placeholder="Add tech (e.g. Next.js, OpenAI)..."
                        />
                        {availableTechStacks.length > 0 && (
                            <div className="mt-2.5">
                                <span className="text-xs text-[#888888] block mb-1.5 font-medium">
                                    Quick Select from Core Technologies:
                                </span>
                                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-[#222222] bg-[#0c0c0e]">
                                    {availableTechStacks.map((stack) => {
                                        const isSelected = (formData.tech_stack || []).some(
                                            (t) => t.toLowerCase().trim() === stack.name.toLowerCase().trim()
                                        );
                                        return (
                                            <button
                                                key={stack.id}
                                                type="button"
                                                onClick={() => {
                                                    const current = formData.tech_stack || [];
                                                    if (isSelected) {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            tech_stack: current.filter(
                                                                (t) => t.toLowerCase().trim() !== stack.name.toLowerCase().trim()
                                                            ),
                                                        }));
                                                    } else {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            tech_stack: [...current, stack.name],
                                                        }));
                                                    }
                                                }}
                                                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#6DD33D]/20 text-[#6DD33D] border border-[#6DD33D]/40 font-semibold'
                                                        : 'bg-[#18181a] text-[#888888] border border-[#2a2a2a] hover:text-white hover:border-[#444444]'
                                                }`}
                                            >
                                                {stack.icon_url && (
                                                    <img
                                                        src={stack.icon_url}
                                                        alt={stack.name}
                                                        className="h-3.5 w-3.5 object-contain"
                                                    />
                                                )}
                                                <span>{stack.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#CCCCCC]">Demo Link</label>
                            <input
                                type="url"
                                name="demo_link"
                                value={formData.demo_link}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2 text-sm text-white focus:border-[#6DD33D] focus:outline-none focus:ring-1 focus:ring-[#6DD33D]"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#CCCCCC]">Repo Link</label>
                            <input
                                type="url"
                                name="repo_link"
                                value={formData.repo_link}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                                className="w-full rounded-lg border border-[#333333] bg-[#141414] px-3 py-2 text-sm text-white focus:border-[#6DD33D] focus:outline-none focus:ring-1 focus:ring-[#6DD33D]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-[#1f1f1f]">
                <h3 className="text-base font-bold text-[#6DD33D] uppercase tracking-wider">
                    Engineering Case Study Sections
                </h3>

                <ProjectTextEditor
                    id="project-background"
                    label="1. Background (Why this project was created)"
                    value={formData.background}
                    onChange={(background) => setFormData((current) => ({ ...current, background }))}
                    minHeight="min-h-36"
                    placeholder="Describe the context, problem statement, and motivation behind this project..."
                    allowLegacyHtml
                />

                <ProjectTextEditor
                    id="project-implementation"
                    label="2. Implementation (What you built & Tech elaboration)"
                    value={formData.implementation}
                    onChange={(implementation) => setFormData((current) => ({ ...current, implementation }))}
                    minHeight="min-h-48"
                    placeholder="Elaborate what was built, system architecture, core features, and technical trade-offs..."
                    allowLegacyHtml
                />

                <ProjectTextEditor
                    id="project-struggle"
                    label="3. Struggles & Key Learnings (Challenges during development)"
                    value={formData.struggle}
                    onChange={(struggle) => setFormData((current) => ({ ...current, struggle }))}
                    minHeight="min-h-36"
                    placeholder="Discuss technical bottlenecks, debugging hurdles, and lessons learned..."
                    allowLegacyHtml
                />

                <ProjectTextEditor
                    id="project-long-description"
                    label="Additional / Legacy Long Description"
                    value={formData.long_description}
                    onChange={(long_description) => setFormData((current) => ({ ...current, long_description }))}
                    minHeight="min-h-32"
                    placeholder="Any general project details or fallback description..."
                    allowLegacyHtml
                />
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1f1f1f]">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg bg-[#6DD33D] px-6 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-[#5bc232] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6DD33D] disabled:opacity-50 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {initialData ? 'Update Project' : 'Create Project'}
                </button>
            </div>
        </form>
    );
}
