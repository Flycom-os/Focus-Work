import { Tldraw, useYjsStore, Minimap } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { Link, useParams } from 'react-router-dom';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { CustomToolbar } from './CustomToolbar';
import { CustomCursor } from './CustomCursor';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3000';

export function MiroBoardPage() {
  const { boardId } = useParams();
  if (!boardId) throw new Error('Board ID is required');

  const store = useYjsStore({
    hostUrl: WS_URL,
    roomName: boardId,
  });

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        store={store}
        components={{
          Toolbar: CustomToolbar,
          Cursor: CustomCursor,
          Minimap: Minimap,
        }}
      >
        {/* You can add custom UI components here */}
      </Tldraw>
      
      
    </div>
  );
}
