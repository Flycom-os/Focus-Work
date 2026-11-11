'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { IconItem } from '../types/icon';
import rawIconsData from '../data/icons-manifest.json';
import './IconGallery.css';

const allIcons = rawIconsData as IconItem[];

export interface IconGalleryProps {
  initialSource?: 'all' | 'jetbrains' | 'lucide';
  itemsPerPage?: number;
}

export const IconGallery: React.FC<IconGalleryProps> = ({
  initialSource = 'all',
  itemsPerPage = 96,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'jetbrains' | 'lucide'>(initialSource);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark' | 'checker'>('light');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);

  // Filter icons
  const filteredIcons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allIcons.filter((icon) => {
      if (selectedSource !== 'all' && icon.source !== selectedSource) {
        return false;
      }
      if (!q) return true;

      const matchesName = icon.name.toLowerCase().includes(q);
      const matchesTag = icon.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = icon.categories?.some((c) => c.toLowerCase().includes(q));

      return matchesName || matchesTag || matchesCategory;
    });
  }, [searchQuery, selectedSource]);

  // Pagination
  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedIcons = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredIcons.slice(start, start + itemsPerPage);
  }, [filteredIcons, safePage, itemsPerPage]);

  // Counts
  const counts = useMemo(() => {
    let jetbrains = 0;
    let lucide = 0;
    for (const icon of allIcons) {
      if (icon.source === 'jetbrains') jetbrains++;
      else if (icon.source === 'lucide') lucide++;
    }
    return {
      all: allIcons.length,
      jetbrains,
      lucide,
    };
  }, []);

  const handleSourceChange = (src: 'all' | 'jetbrains' | 'lucide') => {
    setSelectedSource(src);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }, []);

  const openIconDetails = useCallback(async (icon: IconItem) => {
    setSelectedIcon(icon);
    setIsLoadingSvg(true);
    try {
      const res = await fetch(icon.path);
      const svgText = await res.text();
      setSvgContent(svgText);
    } catch {
      setSvgContent('');
    } finally {
      setIsLoadingSvg(false);
    }
  }, []);

  const getThemeCardClass = () => {
    if (previewTheme === 'dark') return 'theme-dark';
    if (previewTheme === 'checker') return 'theme-checker';
    return '';
  };

  return (
    <div className="ig-container">
      {/* Header */}
      <div className="ig-header">
        <div className="ig-header-top">
          <div>
            <h1 className="ig-title">Icon Gallery</h1>
            <p className="ig-subtitle">
              Browse, search, inspect, and copy from <strong>{counts.all.toLocaleString()}</strong> icons:
              JetBrains ({counts.jetbrains.toLocaleString()}) & Lucide ({counts.lucide.toLocaleString()})
            </p>
          </div>

          {/* Theme preview toggle */}
          <div className="ig-theme-toggle">
            <span className="ig-theme-label">Canvas:</span>
            <button
              type="button"
              onClick={() => setPreviewTheme('light')}
              className={`ig-theme-btn ${previewTheme === 'light' ? 'active' : ''}`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme('dark')}
              className={`ig-theme-btn ${previewTheme === 'dark' ? 'active dark' : ''}`}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme('checker')}
              className={`ig-theme-btn ${previewTheme === 'checker' ? 'active' : ''}`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="ig-controls">
          {/* Source Tabs */}
          <div className="ig-tabs">
            <button
              type="button"
              onClick={() => handleSourceChange('all')}
              className={`ig-tab ${selectedSource === 'all' ? 'active-all' : ''}`}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => handleSourceChange('jetbrains')}
              className={`ig-tab ${selectedSource === 'jetbrains' ? 'active-jetbrains' : ''}`}
            >
              <span className="ig-dot" style={{ backgroundColor: '#fbbf24' }} />
              JetBrains ({counts.jetbrains})
            </button>
            <button
              type="button"
              onClick={() => handleSourceChange('lucide')}
              className={`ig-tab ${selectedSource === 'lucide' ? 'active-lucide' : ''}`}
            >
              <span className="ig-dot" style={{ backgroundColor: '#818cf8' }} />
              Lucide ({counts.lucide})
            </button>
          </div>

          {/* Search Box */}
          <div className="ig-search-box">
            <svg
              className="ig-search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search icons by name, tag, or category..."
              className="ig-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ig-search-clear"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results summary & Pagination Top */}
        <div className="ig-status-bar">
          <div>
            Showing <strong>{filteredIcons.length ? (safePage - 1) * itemsPerPage + 1 : 0}</strong>–
            <strong>{Math.min(safePage * itemsPerPage, filteredIcons.length)}</strong> of{' '}
            <strong>{filteredIcons.length}</strong> matching icons
          </div>

          {totalPages > 1 && (
            <div className="ig-mini-nav">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="ig-mini-btn"
              >
                Previous
              </button>
              <span>
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="ig-mini-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of icons */}
      {filteredIcons.length === 0 ? (
        <div className="ig-empty">
          <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: '#1e293b' }}>
            No icons match "{searchQuery}"
          </p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px 0' }}>
            Try another search keyword or clear the filter
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSource('all');
            }}
            className="ig-btn-primary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="ig-grid">
          {paginatedIcons.map((icon) => (
            <div
              key={icon.id}
              onClick={() => openIconDetails(icon)}
              className={`ig-card ${getThemeCardClass()}`}
            >
              {/* Source Badge & Size */}
              <div className="ig-card-top">
                <span className={`ig-badge ${icon.source === 'jetbrains' ? 'jb' : 'lucide'}`}>
                  {icon.source === 'jetbrains' ? 'JB' : 'Lucide'}
                </span>
                {icon.size && <span className="ig-size">{icon.size}</span>}
              </div>

              {/* Icon Image with explicit width/height constraints */}
              <div className="ig-icon-wrapper">
                <img
                  src={icon.path}
                  alt={icon.name}
                  className="ig-icon-img"
                  style={{
                    width: 24,
                    height: 24,
                    maxWidth: 24,
                    maxHeight: 24,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  loading="lazy"
                />
              </div>

              {/* Name */}
              <span title={icon.name} className="ig-card-name">
                {icon.name}
              </span>

              {/* Quick copy overlay on hover */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(icon.name, `name-${icon.id}`);
                }}
                className="ig-card-copy-hint"
              >
                {copiedType === `name-${icon.id}` ? '✓ Copied!' : 'Copy Name'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="ig-pagination">
          <div>
            Page {safePage} of {totalPages} ({filteredIcons.length} icons total)
          </div>
          <div className="ig-pag-buttons">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(1)}
              className="ig-pag-btn"
            >
              First
            </button>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="ig-pag-btn"
            >
              Previous
            </button>
            <div className="ig-pag-current">{safePage}</div>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="ig-pag-btn"
            >
              Next
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="ig-pag-btn"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIcon && (
        <div className="ig-modal-overlay" onClick={() => setSelectedIcon(null)}>
          <div className="ig-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="ig-modal-header">
              <div>
                <span className={`ig-badge ${selectedIcon.source === 'jetbrains' ? 'jb' : 'lucide'}`}>
                  {selectedIcon.source === 'jetbrains' ? 'JetBrains Icon' : 'Lucide Icon'}
                </span>
                <h3 className="ig-modal-title">{selectedIcon.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIcon(null)}
                className="ig-modal-close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="ig-modal-preview">
              <div className="ig-modal-preview-box">
                <img
                  src={selectedIcon.path}
                  alt={selectedIcon.name}
                  className="ig-modal-preview-img"
                  style={{
                    width: 36,
                    height: 36,
                    maxWidth: 36,
                    maxHeight: 36,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
              <span className="ig-modal-filename">{selectedIcon.filename}</span>
            </div>

            {/* Tags / Categories */}
            {selectedIcon.tags && selectedIcon.tags.length > 0 && (
              <div className="ig-modal-tags">
                {selectedIcon.tags.map((tag) => (
                  <span key={tag} className="ig-modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="ig-modal-actions">
              <button
                type="button"
                onClick={() => copyToClipboard(selectedIcon.name, 'name-modal')}
                className="ig-btn-secondary"
              >
                {copiedType === 'name-modal' ? '✓ Copied Name!' : 'Copy Name'}
              </button>

              <button
                type="button"
                disabled={isLoadingSvg || !svgContent}
                onClick={() => copyToClipboard(svgContent, 'svg-modal')}
                className="ig-btn-primary"
              >
                {copiedType === 'svg-modal' ? '✓ Copied SVG!' : 'Copy SVG'}
              </button>
            </div>

            {/* Code Snippet */}
            <div className="ig-modal-snippet">
              <div className="ig-modal-snippet-label">HTML / JSX snippet:</div>
              <code>{`<img src="${selectedIcon.path}" alt="${selectedIcon.name}" width="24" height="24" />`}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconGallery;
