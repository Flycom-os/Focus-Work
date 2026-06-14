import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type YtIssue } from '../../shared/api/api';
import { useAuth } from '../../app/providers/AuthProvider';

export function TrackerIssuePage() {
  const { issueId } = useParams<{ issueId: string }>();
  const { accessToken } = useAuth();
  const [issue, setIssue] = useState<YtIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!issueId || !accessToken) return;

    const fetchIssue = async () => {
      try {
        setLoading(true);
        const fetchedIssue = await api.ytTracker.issues.get(accessToken, issueId);
        setIssue(fetchedIssue);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch issue');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [issueId, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!issue) {
    return <div>Issue not found.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{issue.key}: {issue.summary}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
        <div>
          <h2>Description</h2>
          <textarea
            readOnly
            value={issue.description || 'No description provided.'}
            style={{ width: '100%', height: '300px', fontFamily: 'monospace' }}
          />
          {/* Tabs for Comments, History, etc. will go here */}
        </div>
        <div>
          <h2>Details</h2>
          <p><strong>State:</strong> {issue.stateId || 'N/A'}</p>
          <p><strong>Assignee:</strong> {issue.assigneeId || 'Unassigned'}</p>
          <p><strong>Priority:</strong> {issue.priorityId || 'N/A'}</p>
          {/* Other custom fields will go here */}
        </div>
      </div>
    </div>
  );
}
