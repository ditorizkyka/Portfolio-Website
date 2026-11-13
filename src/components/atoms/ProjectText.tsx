import { isRichProjectText, projectTextHtml, projectTitleHtml } from '@/src/lib/projectText';

export function ProjectTitle({ value }: { value: string }) {
    if (!isRichProjectText(value)) return value;

    return <span className="project-title" dangerouslySetInnerHTML={{ __html: projectTitleHtml(value) }} />;
}

export function ProjectText({
    value,
    className = '',
    allowLegacyHtml = false,
}: {
    value: string;
    className?: string;
    allowLegacyHtml?: boolean;
}) {
    return (
        <div
            className={`project-text ${className}`.trim()}
            dangerouslySetInnerHTML={{ __html: projectTextHtml(value, allowLegacyHtml) }}
        />
    );
}
