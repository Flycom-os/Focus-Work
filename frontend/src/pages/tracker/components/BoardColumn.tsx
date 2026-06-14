import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IssueCard } from './IssueCard';
import { type YtBoardColumn, type YtIssue } from '../../../shared/api/api';

export function BoardColumn({ column, issues }: { column: YtBoardColumn, issues: YtIssue[] }) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const style = {
        padding: '1rem',
        backgroundColor: '#f4f5f7',
        borderRadius: '3px',
        width: '250px',
        minHeight: '400px',
    };

    return (
        <div ref={setNodeRef} style={style}>
            <h2>{column.name}</h2>
            <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {issues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}
            </SortableContext>
        </div>
    );
}
