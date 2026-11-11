export interface IconItem {
  id: string;
  name: string;
  source: 'jetbrains' | 'lucide';
  filename: string;
  path: string;
  size?: string;
  tags?: string[];
  categories?: string[];
}
