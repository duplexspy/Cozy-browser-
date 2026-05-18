/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { WebTab, Bookmark, Extension, TabGroup } from '../types';

export const useBrowser = () => {
  const [tabs, setTabs] = useState<WebTab[]>([
    {
      id: '1',
      title: 'New Tab',
      url: 'about:blank',
      active: true,
      loading: false,
      history: ['about:blank'],
      historyIndex: 0,
    },
  ]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([
    {
      id: 'adblock',
      name: 'AdBlock Pro',
      version: '1.0.0',
      description: 'Block annoying ads.',
      enabled: true,
      icon: 'shield',
    },
  ]);
  const [tabGroups, setTabGroups] = useState<TabGroup[]>([]);
  const [isIncognito, setIsIncognito] = useState(false);

  const activeTab = tabs.find((t) => t.active);

  const addTab = useCallback((url = 'about:blank', title = 'New Tab') => {
    const newId = Math.random().toString(36).substring(7);
    setTabs((prev) => [
      ...prev.map((t) => ({ ...t, active: false })),
      {
        id: newId,
        title,
        url,
        active: true,
        loading: false,
        history: [url],
        historyIndex: 0,
      },
    ]);
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      if (prev.length === 1) return prev;
      const index = prev.findIndex((t) => t.id === id);
      const newTabs = prev.filter((t) => t.id !== id);
      if (prev[index].active) {
        const nextIndex = Math.max(0, index - 1);
        newTabs[nextIndex].active = true;
      }
      return newTabs;
    });
  }, []);

  const switchTab = useCallback((id: string) => {
    setTabs((prev) => prev.map((t) => ({ ...t, active: t.id === id })));
  }, []);

  const navigate = useCallback((url: string) => {
    let finalUrl = url;
    if (!url.startsWith('http') && !url.startsWith('about:')) {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }
    setTabs((prev) =>
      prev.map((t) => {
        if (t.active) {
          const newHistory = [...t.history.slice(0, t.historyIndex + 1), finalUrl];
          return {
            ...t,
            url: finalUrl,
            title: finalUrl.includes('google.com') ? 'Google Search' : finalUrl,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }
        return t;
      })
    );
  }, []);

  const goBack = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.active && t.historyIndex > 0) {
          const newIndex = t.historyIndex - 1;
          return {
            ...t,
            url: t.history[newIndex],
            historyIndex: newIndex,
          };
        }
        return t;
      })
    );
  }, []);

  const goForward = useCallback(() => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.active && t.historyIndex < t.history.length - 1) {
          const newIndex = t.historyIndex + 1;
          return {
            ...t,
            url: t.history[newIndex],
            historyIndex: newIndex,
          };
        }
        return t;
      })
    );
  }, []);

  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [splitTabId, setSplitTabId] = useState<string | null>(null);

  const toggleSplitScreen = useCallback(() => {
    setIsSplitScreen((prev) => !prev);
    if (!isSplitScreen && tabs.length > 1) {
      const otherTab = tabs.find(t => !t.active);
      if (otherTab) setSplitTabId(otherTab.id);
    }
  }, [isSplitScreen, tabs]);

  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    switchTab,
    navigate,
    goBack,
    goForward,
    bookmarks,
    extensions,
    tabGroups,
    isIncognito,
    setIsIncognito,
    isSplitScreen,
    toggleSplitScreen,
    splitTabId,
    setSplitTabId
  };
}
