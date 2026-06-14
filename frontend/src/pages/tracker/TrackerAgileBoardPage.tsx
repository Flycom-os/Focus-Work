import { useState, useEffect } from 'react';
import {
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { BoardColumn } from './components/BoardColumn';
import { type YtIssue, type YtAgileBoard } from '../../shared/api/api';
// import { useAuth } from '../../app/providers/AuthProvider'; // Not used yet

// This page is becoming complex and needs a proper state management solution
// and backend integration to be fully functional. The following is a best-effort
// implementation based on the user's request, but it is untested.

export function TrackerAgileBoardPage() {
    // const { accessToken } = useAuth(); // Not used yet
    const [board, setBoard] = useState<YtAgileBoard | null>(null);
    const [issues, setIssues] = useState<YtIssue[]>([]);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    // This useEffect is for DEMONSTRATION only, as there's no backend data yet.
    useEffect(() => {
        const MOCK_BOARD: YtAgileBoard = {
            id: 'mock-board-id', name: 'My Project Board', isScrum: false, projectId: 'mock-project-id',
            columns: [
                { id: 'col-1', name: 'To Do', states: ['state-1'], boardId: 'mock-board-id', order: 0, wipLimit: null },
                { id: 'col-2', name: 'In Progress', states: ['state-2'], boardId: 'mock-board-id', order: 1, wipLimit: null },
                { id: 'col-3', name: 'Done', states: ['state-3'], boardId: 'mock-board-id', order: 2, wipLimit: null },
            ],
        };
        const MOCK_ISSUES: YtIssue[] = [
            // @ts-ignore
            { id: 'issue-1', key: 'PROJ-1', summary: 'First task', stateId: 'state-1' },
            // @ts-ignore
            { id: 'issue-2', key: 'PROJ-2', summary: 'Second task', stateId: 'state-1' },
            // @ts-ignore
            { id: 'issue-3', key: 'PROJ-3', summary: 'Third task', stateId: 'state-2' },
        ];
        setBoard(MOCK_BOARD);
        setIssues(MOCK_ISSUES);
        setLoading(false);
    }, []);

    function getIssuesForColumn(columnState: string) {
        return issues.filter(issue => issue.stateId === columnState);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeIsIssue = issues.some(i => i.id === active.id);
            const overIsColumn = board?.columns.some(c => c.id === over.id);

            if (activeIsIssue && overIsColumn) {
                // Move issue to a different column
                const issueId = active.id;
                const targetColumnId = over.id;
                const targetColumn = board!.columns.find(c => c.id === targetColumnId);
                if (!targetColumn) return;

                const newStateId = targetColumn.states[0];

                setIssues(prevIssues =>
                    prevIssues.map(issue =>
                        issue.id === issueId ? { ...issue, stateId: newStateId } : issue
                    )
                );

                // API call to update issue state would go here
                // if (accessToken) {
                //     api.ytTracker.issues.update(accessToken, issueId as string, { stateId: newStateId });
                // }
            }
        }
    }
    
    if (loading) return <div>Loading board...</div>;
    if (!board) return <div>No board configured.</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{board.name}</h1>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {board.columns.map(column => (
                        <BoardColumn
                            key={column.id}
                            column={column}
                            issues={getIssuesForColumn(column.states[0])}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
