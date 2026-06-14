import { Element as PrismaElement, ElementType } from '@prisma/client';

// The full Element type received from the backend
export type MiroElement = Omit<PrismaElement, 'board' | 'linkedIssue'>;

// The full MiroBoard type, including its elements
export type MiroBoardListItem = {
    id: string;
    name: string;
    description?: string | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    _count?: {
        elements: number;
        members: number;
    };
};

export type MiroBoard = {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  settings?: any;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members: BoardMember[];
  elements: MiroElement[];
};

export type BoardMember = {
  role: 'OWNER' | 'EDITOR' | 'VIEWER' | 'COMMENTER';
  user: {
    id: string;
    fullName: string;
    icon?: string | null;
  };
};

// DTO for syncing a single element
export type SyncElementDto = {
    id: string;
    boardId: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
    style?: any;
    content?: any;
    linkedIssueId?: string | null;
};

// DTO for syncing the entire board state
export type SyncBoardDto = {
    elements: SyncElementDto[];
    deletedElementIds: string[];
};
