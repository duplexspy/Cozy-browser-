/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum BrowserTheme {
  GAMING = 'gaming',
  FOCUS = 'focus',
  KIDS = 'kids',
  DARK = 'dark',
  LIGHT = 'light'
}

export interface WebTab {
  id: string;
  title: string;
  url: string;
  icon?: string;
  active: boolean;
  groupId?: string;
  loading: boolean;
  history: string[];
  historyIndex: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId?: string;
}

export interface BookmarkFolder {
  id: string;
  title: string;
}

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export interface TabGroup {
  id: string;
  name: string;
  color: string;
}
