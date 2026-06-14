import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type YtIssue } from '../../../shared/api/api';

export function IssueCard({ issue }: { issue: YtIssue }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: issue.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '3px',
        backgroundColor: 'white',
        marginBottom: '0.5rem',
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {issue.key}: {issue.summary}
        </div>
    );
}
