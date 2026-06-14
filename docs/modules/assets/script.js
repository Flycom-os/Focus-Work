// Main layout and interactivity script for Focus-Work Docs

document.addEventListener("DOMContentLoaded", () => {
  // 1. Determine folder prefix based on current file location
  const path = window.location.href;
  const isSubFolder = path.includes('/tasks/') || path.includes('/whiteboard/') || path.includes('/crm/') ||
                      path.includes('\\tasks\\') || path.includes('\\whiteboard\\') || path.includes('\\crm\\');
  const prefix = isSubFolder ? "../" : "./";

  // 2. Load Dark Mode from LocalStorage
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // 3. Render Header
  const headerContainer = document.getElementById("doc-header");
  if (headerContainer) {
    headerContainer.className = "sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95";
    headerContainer.innerHTML = `
      <div class="flex items-center gap-4">
        <button id="mobile-sidebar-toggle" class="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Focus-Work</span>
          <span class="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">docs v2.4</span>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Search bar trigger -->
        <button id="search-trigger" class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 md:w-64">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="hidden md:inline">Поиск по документации...</span>
          <kbd class="hidden rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400 md:inline">/</kbd>
        </button>

        <!-- Theme Toggle -->
        <button id="theme-toggle" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" title="Переключить тему">
          <svg id="theme-icon-light" class="hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg id="theme-icon-dark" class="hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    `;
    updateThemeIcon();
  }

  // 4. Render Sidebar (Navigation)
  const sidebarContainer = document.getElementById("doc-sidebar");
  if (sidebarContainer) {
    sidebarContainer.className = "fixed bottom-0 top-16 z-30 hidden w-64 flex-col border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 lg:flex overflow-y-auto";
    
    // Get current filename relative to modules directory
    let currentFile = "";
    if (isSubFolder) {
      // e.g. tasks/code.html
      const parts = window.location.pathname.replace(/\\/g, '/').split('/');
      currentFile = parts[parts.length - 2] + "/" + parts[parts.length - 1];
    } else {
      // e.g. index.html
      const parts = window.location.pathname.replace(/\\/g, '/').split('/');
      currentFile = parts[parts.length - 1] || "index.html";
    }

    let sidebarHTML = `<nav class="flex flex-col gap-6">`;
    window.DOCS_NAVIGATION.forEach(section => {
      sidebarHTML += `<div>
        <h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">${section.title}</h3>
        <ul class="space-y-1">`;
      
      section.items.forEach(item => {
        // Build correct relative path
        const relativePath = isSubFolder 
          ? (item.path.startsWith("index.html") ? "../index.html" : "../" + item.path)
          : (item.path.startsWith("index.html") ? "./index.html" : "./" + item.path);
        
        // Check if active
        const isActive = currentFile === item.path || 
                        (currentFile === "index.html" && item.path === "index.html");
        
        sidebarHTML += `
          <li>
            <a href="${relativePath}" id="nav-item-${item.id}" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
              isActive 
                ? 'active-nav-link' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50'
            }">
              <span>${item.name}</span>
            </a>
          </li>
        `;
      });
      sidebarHTML += `</ul></div>`;
    });
    sidebarHTML += `</nav>`;
    sidebarContainer.innerHTML = sidebarHTML;
  }

  // 5. Render Mobile Sidebar (Drawer)
  const bodyElement = document.body;
  const mobileDrawer = document.createElement("div");
  mobileDrawer.id = "mobile-sidebar-drawer";
  mobileDrawer.className = "fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-sm lg:hidden";
  mobileDrawer.innerHTML = `
    <div class="fixed bottom-0 top-0 left-0 w-64 bg-slate-50 p-4 dark:bg-slate-950 flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform -translate-x-full" id="mobile-drawer-content">
      <div class="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <span class="font-bold text-lg text-slate-900 dark:text-slate-50">Навигация</span>
        <button id="mobile-sidebar-close" class="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div id="mobile-sidebar-links" class="overflow-y-auto flex-1"></div>
    </div>
  `;
  bodyElement.appendChild(mobileDrawer);

  const mobileLinksContainer = document.getElementById("mobile-sidebar-links");
  if (mobileLinksContainer && sidebarContainer) {
    mobileLinksContainer.innerHTML = sidebarContainer.innerHTML;
  }

  // Drawer Toggle Events
  const mobileToggleBtn = document.getElementById("mobile-sidebar-toggle");
  const mobileCloseBtn = document.getElementById("mobile-sidebar-close");
  const drawerContent = document.getElementById("mobile-drawer-content");

  const openDrawer = () => {
    mobileDrawer.classList.remove("hidden");
    setTimeout(() => {
      drawerContent.classList.remove("-translate-x-full");
    }, 10);
  };

  const closeDrawer = () => {
    drawerContent.classList.add("-translate-x-full");
    setTimeout(() => {
      mobileDrawer.classList.add("hidden");
    }, 300);
  };

  if (mobileToggleBtn) mobileToggleBtn.addEventListener("click", openDrawer);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", closeDrawer);
  mobileDrawer.addEventListener("click", (e) => {
    if (e.target === mobileDrawer) closeDrawer();
  });

  // 6. Build Table of Contents (Right Sidebar)
  const tocContainer = document.getElementById("doc-toc");
  const contentArea = document.querySelector("main article");
  if (tocContainer && contentArea) {
    tocContainer.className = "fixed bottom-0 top-16 right-0 z-30 hidden w-64 flex-col border-l border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 xl:flex overflow-y-auto";
    
    const headers = contentArea.querySelectorAll("h2, h3");
    if (headers.length > 0) {
      let tocHTML = `
        <h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">На этой странице</h3>
        <ul class="space-y-2 text-sm border-l border-slate-100 dark:border-slate-800 pl-2">
      `;
      
      headers.forEach((header, index) => {
        // Ensure header has an id
        if (!header.id) {
          header.id = `header-ref-${index}`;
        }
        
        const indent = header.tagName.toLowerCase() === "h3" ? "pl-4" : "";
        const sizeClass = header.tagName.toLowerCase() === "h3" ? "text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900" : "font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950";
        
        tocHTML += `
          <li class="${indent}">
            <a href="#${header.id}" class="block py-1 transition-colors duration-150 ${sizeClass}">
              ${header.textContent.replace(/🔗/g, '').trim()}
            </a>
          </li>
        `;
      });
      
      tocHTML += `</ul>`;
      tocContainer.innerHTML = tocHTML;
    } else {
      tocContainer.innerHTML = `<p class="text-xs text-slate-400 px-3">Нет подразделов на странице</p>`;
    }
  }

  // 7. Render Search Modal
  const searchModal = document.createElement("div");
  searchModal.id = "search-modal";
  searchModal.className = "fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-sm p-4 md:p-10 flex items-start justify-center";
  searchModal.innerHTML = `
    <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-10 md:mt-20 transform transition-all">
      <!-- Search Input -->
      <div class="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800 h-14">
        <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" id="search-input" placeholder="Поиск по разделам, коду, тегам..." class="w-full bg-transparent border-0 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base" />
        <button id="search-close" class="text-xs rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">ESC</button>
      </div>
      <!-- Search Results -->
      <div id="search-results" class="max-h-[400px] overflow-y-auto p-4 space-y-2">
        <p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Начните вводить поисковой запрос...</p>
      </div>
      <!-- Search Footer -->
      <div class="h-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400">
        <div>Найдено результатов: <span id="search-results-count" class="font-semibold text-slate-600 dark:text-slate-300">0</span></div>
        <div>Используйте стрелки ↑↓ и Enter для выбора</div>
      </div>
    </div>
  `;
  bodyElement.appendChild(searchModal);

  const searchTrigger = document.getElementById("search-trigger");
  const searchClose = document.getElementById("search-close");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchResultsCount = document.getElementById("search-results-count");

  const openSearch = () => {
    searchModal.classList.remove("hidden");
    searchInput.value = "";
    searchResults.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Введите запрос...</p>`;
    searchResultsCount.textContent = "0";
    setTimeout(() => searchInput.focus(), 50);
  };

  const closeSearch = () => {
    searchModal.classList.add("hidden");
  };

  if (searchTrigger) searchTrigger.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) closeSearch();
  });

  // Hotkeys: '/' to search, 'ESC' to close
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape") {
      closeSearch();
    }
  });

  // Search Logic
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        searchResults.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Введите запрос...</p>`;
        searchResultsCount.textContent = "0";
        return;
      }

      const index = window.DOCS_SEARCH_INDEX || [];
      const matches = index.filter(item => {
        return item.title.toLowerCase().includes(query) || 
               item.description.toLowerCase().includes(query) || 
               item.tags.some(tag => tag.toLowerCase().includes(query));
      });

      searchResultsCount.textContent = matches.length;

      if (matches.length === 0) {
        searchResults.innerHTML = `<p class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Совпадений не найдено 😢</p>`;
        return;
      }

      let resultsHTML = "";
      matches.forEach(item => {
        // Build path prefix
        const finalUrl = prefix + item.url;
        
        resultsHTML += `
          <a href="${finalUrl}" class="block p-3 rounded-lg border border-slate-100 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all">
            <div class="font-semibold text-slate-900 dark:text-slate-50 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between">
              <span>${item.title}</span>
              <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">${item.description}</p>
            <div class="flex gap-1.5 mt-2 flex-wrap">
              ${item.tags.map(tag => `<span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">${tag}</span>`).join('')}
            </div>
          </a>
        `;
      });
      searchResults.innerHTML = resultsHTML;
    });
  }

  // 8. Theme Switcher Logic
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon();
      
      // Notify mermaid if loaded to re-render in theme colors (if required)
      if (window.mermaid) {
        // Reload page is simplest, or force re-draw. Let's just reload or trigger custom event
        location.reload();
      }
    });
  }

  function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains("dark");
    const lightIcon = document.getElementById("theme-icon-light");
    const darkIcon = document.getElementById("theme-icon-dark");
    
    if (isDark) {
      if (lightIcon) lightIcon.classList.remove("hidden");
      if (darkIcon) darkIcon.classList.add("hidden");
    } else {
      if (lightIcon) lightIcon.classList.add("hidden");
      if (darkIcon) darkIcon.classList.remove("hidden");
    }
  }

  // 9. Format Code Panels and Copy Buttons
  const preBlocks = document.querySelectorAll("pre");
  preBlocks.forEach((pre, index) => {
    // Only wrap elements that contain <code>
    const code = pre.querySelector("code");
    if (!code) return;

    // Retrieve language and filename attributes
    const lang = code.className.replace("language-", "").trim() || "code";
    const filename = pre.getAttribute("data-filename") || "";

    // Set styling for the <pre> block
    pre.className = "p-4 overflow-x-auto bg-slate-900 text-slate-100 rounded-b-lg text-sm border-t border-slate-800";

    // Create wrapper div
    const wrapper = document.createElement("div");
    wrapper.className = "my-6 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm";
    
    // Create header panel
    const header = document.createElement("div");
    header.className = "flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400";
    
    const fileSpan = document.createElement("span");
    fileSpan.className = "flex items-center gap-1.5";
    if (filename) {
      fileSpan.innerHTML = `
        <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>${filename}</span>
      `;
    } else {
      fileSpan.textContent = lang.toUpperCase();
    }

    const copyBtn = document.createElement("button");
    copyBtn.className = "flex items-center gap-1 rounded bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 px-2.5 py-1 text-[11px] border border-slate-200 dark:border-slate-800 transition-colors shadow-sm";
    copyBtn.innerHTML = `
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
      <span>Копировать</span>
    `;

    copyBtn.addEventListener("click", () => {
      // Copy code content
      navigator.clipboard.writeText(code.innerText).then(() => {
        copyBtn.classList.add("copy-pop", "text-emerald-600", "dark:text-emerald-400", "border-emerald-200", "dark:border-emerald-800");
        copyBtn.querySelector("span").textContent = "Скопировано!";
        
        setTimeout(() => {
          copyBtn.classList.remove("copy-pop", "text-emerald-600", "dark:text-emerald-400", "border-emerald-200", "dark:border-emerald-800");
          copyBtn.querySelector("span").textContent = "Копировать";
        }, 2000);
      });
    });

    header.appendChild(fileSpan);
    header.appendChild(copyBtn);

    // Swap nodes in DOM
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });

  // 10. Accordion / Collapsible headers
  const collapsibles = document.querySelectorAll(".collapsible-trigger");
  collapsibles.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector(".collapsible-icon");
      
      if (content && content.classList.contains("collapsible-content")) {
        const isOpen = !content.classList.contains("hidden");
        if (isOpen) {
          content.classList.add("hidden");
          if (icon) icon.classList.remove("rotate-90");
        } else {
          content.classList.remove("hidden");
          if (icon) icon.classList.add("rotate-90");
        }
      }
    });
  });

  // 11. Load and Render Mermaid Diagrams (if page contains them)
  const hasMermaid = document.querySelector(".mermaid");
  if (hasMermaid && window.mermaid) {
    const isDark = document.documentElement.classList.contains("dark");
    window.mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: {
        background: isDark ? '#0f172a' : '#f8fafc',
        primaryColor: '#6366f1',
        edgeLabelBackground: isDark ? '#1e293b' : '#ffffff',
      }
    });
  }
});
