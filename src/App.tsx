/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Home, 
  Search, 
  Settings, 
  Bookmark, 
  History as HistoryIcon, 
  Download, 
  User, 
  Shield, 
  MoreVertical,
  Layers,
  Calculator,
  StickyNote,
  MessageCircle,
  Monitor,
  Gamepad2,
  Focus,
  Baby,
  Columns2
} from 'lucide-react';
import { useBrowser } from './hooks/useBrowser';
import { useTheme } from './context/ThemeContext';
import { BrowserTheme } from './types';

export default function Browser() {
  const browser = useBrowser();
  const { theme, setTheme } = useTheme();
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [addressValue, setAddressValue] = React.useState('');
  const [showWidgets, setShowWidgets] = React.useState<string | null>(null);

  // Sync address bar with active tab url
  React.useEffect(() => {
    if (browser.activeTab) {
      setAddressValue(browser.activeTab.url === 'about:blank' ? '' : browser.activeTab.url);
    }
  }, [browser.activeTab?.url]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressValue.trim()) {
      browser.navigate(addressValue);
    }
  };

  const getWallpaper = () => {
    switch (theme) {
      case BrowserTheme.GAMING:
        return 'https://picsum.photos/seed/cyber/1920/1080?blur=2';
      case BrowserTheme.KIDS:
        return 'https://picsum.photos/seed/candy/1920/1080?blur=1';
      case BrowserTheme.FOCUS:
      default:
        return 'https://picsum.photos/seed/zen/1920/1080?blur=5';
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden font-sans relative" 
         style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      {/* Background Wallpaper */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getWallpaper()} 
          className="w-full h-full object-cover opacity-30 transition-opacity duration-1000"
          alt="background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Main Browser Frame */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="z-10 w-[95%] h-[90%] bg-[var(--glass-bg)] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
      >
        {/* Tab Bar */}
        <div className="h-12 flex items-center px-4 gap-2 bg-black/10">
          <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <AnimatePresence mode="popLayout">
              {browser.tabs.map((tab) => (
                <motion.div
                  layout
                  key={tab.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => browser.switchTab(tab.id)}
                  className={`
                    group relative h-9 px-4 min-w-[140px] max-w-[200px] flex items-center gap-2 rounded-t-xl cursor-pointer transition-all
                    ${tab.active ? 'bg-[var(--bg-main)] shadow-sm' : 'hover:bg-white/10'}
                  `}
                >
                  <Search size={14} className="opacity-50" />
                  <span className="text-xs font-medium truncate flex-1 opacity-80">
                    {tab.title}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); browser.closeTab(tab.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/10 rounded-full transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {tab.active && (
                    <motion.div 
                      layoutId="active-tab-glow"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" 
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <button 
              onClick={() => browser.addTab()}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors opacity-60"
            >
              <Plus size={18} />
            </button>
          </div>
          
          {/* Theme Switcher Overlay */}
          <div className="flex items-center gap-1 bg-black/5 p-1 rounded-full border border-white/10">
            <ThemeBtn active={theme === BrowserTheme.GAMING} onClick={() => setTheme(BrowserTheme.GAMING)} icon={<Gamepad2 size={14} />} />
            <ThemeBtn active={theme === BrowserTheme.FOCUS} onClick={() => setTheme(BrowserTheme.FOCUS)} icon={<Focus size={14} />} />
            <ThemeBtn active={theme === BrowserTheme.KIDS} onClick={() => setTheme(BrowserTheme.KIDS)} icon={<Baby size={14} />} />
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-14 flex items-center px-4 gap-4 bg-[var(--bg-main)] shadow-sm border-b border-white/10">
          <div className="flex items-center gap-2">
            <ToolbarBtn icon={<ChevronLeft size={18} />} onClick={browser.goBack} />
            <ToolbarBtn icon={<ChevronRight size={18} />} onClick={browser.goForward} />
            <ToolbarBtn icon={<RotateCw size={18} />} />
            <ToolbarBtn icon={<Home size={18} />} onClick={() => browser.navigate('about:blank')} />
          </div>

          <form onSubmit={handleNavigate} className="flex-1 max-w-3xl flex items-center bg-black/5 hover:bg-black/10 transition-colors rounded-full px-4 h-9 gap-3 group border border-transparent focus-within:border-[var(--accent)]/30">
            <Search size={16} className="opacity-40 group-focus-within:text-[var(--accent)]" />
            <input 
              type="text"
              value={addressValue}
              onChange={(e) => setAddressValue(e.target.value)}
              placeholder="Search Google or type a URL"
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
            />
            {browser.isIncognito && <Shield size={14} className="text-purple-400" title="Private Mode" />}
          </form>

          <div className="flex items-center gap-1">
            <button 
              onClick={browser.toggleSplitScreen}
              className={`p-2 rounded-full transition-colors ${browser.isSplitScreen ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'hover:bg-black/5'}`}
              title="Split Screen"
            >
              <Columns2 size={18} />
            </button>
            <button 
              onClick={() => browser.setIsIncognito(!browser.isIncognito)}
              className={`p-2 rounded-full transition-colors ${browser.isIncognito ? 'bg-purple-500/20 text-purple-600' : 'hover:bg-black/5'}`}
            >
              <Shield size={18} />
            </button>
            <ToolbarBtn icon={<Bookmark size={18} />} />
            <ToolbarBtn icon={<User size={18} />} />
            <ToolbarBtn icon={<MoreVertical size={18} />} />
          </div>
        </div>

        {/* Main View Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Vertical Sidebar */}
          <motion.div 
            animate={{ width: showSidebar ? 64 : 0 }}
            className={`flex flex-col items-center py-4 bg-black/5 border-r border-white/10 overflow-hidden shrink-0`}
          >
            <SidebarItem active={showWidgets === 'notes'} onClick={() => setShowWidgets(showWidgets === 'notes' ? null : 'notes')} icon={<StickyNote size={20} />} label="Notes" />
            <SidebarItem active={showWidgets === 'calc'} onClick={() => setShowWidgets(showWidgets === 'calc' ? null : 'calc')} icon={<Calculator size={20} />} label="Calc" />
            <SidebarItem active={showWidgets === 'chat'} onClick={() => setShowWidgets(showWidgets === 'chat' ? null : 'chat')} icon={<MessageCircle size={20} />} label="AI Chat" />
            <div className="mt-auto flex flex-col items-center gap-4">
              <SidebarItem icon={<HistoryIcon size={20} />} label="History" />
              <SidebarItem icon={<Download size={20} />} label="Downloads" />
              <SidebarItem icon={<Settings size={20} />} label="Settings" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 relative bg-white/5 flex overflow-hidden">
            <div className={`flex-1 h-full flex ${browser.isSplitScreen ? 'gap-0.5 bg-black/20' : ''}`}>
              {/* Primary Viewport */}
              <div className="flex-1 h-full relative bg-[var(--bg-main)]">
                {browser.activeTab?.url === 'about:blank' ? (
                  <HomeView browser={browser} />
                ) : (
                  <Viewport url={browser.activeTab?.url} />
                )}
              </div>

              {/* Secondary Viewport (Split Screen) */}
              {browser.isSplitScreen && (
                <div className="flex-1 h-full relative bg-[var(--bg-main)] border-l border-white/10">
                   {browser.splitTabId ? (
                     <Viewport url={browser.tabs.find(t => t.id === browser.splitTabId)?.url} />
                   ) : (
                     <div className="flex-1 h-full flex items-center justify-center p-10 opacity-30">
                       Select another tab to split
                     </div>
                   )}
                   <button 
                     onClick={browser.toggleSplitScreen}
                     className="absolute top-2 right-2 p-1.5 bg-black/10 hover:bg-black/20 rounded-full z-10"
                   >
                     <X size={14} />
                   </button>
                </div>
              )}
            </div>

            {/* Widget Drawers */}
            <AnimatePresence>
              {showWidgets && (
                <motion.div
                  initial={{ x: 400 }}
                  animate={{ x: 0 }}
                  exit={{ x: 400 }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--bg-main)] border-l border-white/10 shadow-2xl z-20 flex flex-col"
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h4 className="font-bold uppercase text-xs tracking-widest opacity-60">{showWidgets}</h4>
                    <button onClick={() => setShowWidgets(null)} className="p-1 hover:bg-black/5 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="p-6 flex-1">
                    {showWidgets === 'notes' && <NotesWidget />}
                    {showWidgets === 'calc' && <CalcWidget />}
                    {showWidgets === 'chat' && <ChatWidget />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-7 bg-black/20 flex items-center px-4 justify-between text-[10px] font-mono opacity-50">
          <div className="flex gap-4">
            <span>READY</span>
            <span>MEM: 1.2GB</span>
            <span>TPS: 60</span>
          </div>
          <div className="flex gap-4">
            <span>{browser.activeTab?.url}</span>
            <span>SSL: VERIFIED</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function HomeView({ browser }: { browser: any }) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-10 animate-in fade-in duration-700 bg-[var(--bg-main)]">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl font-black mb-8 tracking-tighter"
      >
        Cozy<span className="text-[var(--accent)]">Browser</span>
      </motion.h1>
      <div className="grid grid-cols-4 gap-6 w-full max-w-2xl">
        {shortcuts.map((s, i) => (
          <motion.button
            key={s.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => browser.navigate(s.url)}
            className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 group shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <span className="text-xs font-semibold opacity-70 group-hover:opacity-100">{s.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Viewport({ url }: { url?: string }) {
  return (
    <div className="flex-1 w-full h-full relative">
       <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-10 z-10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <Shield size={32} className="mb-4 text-[var(--accent)] opacity-50" />
          <h3 className="text-sm font-bold mb-1 italic">Iframe Safety Layer</h3>
          <p className="text-[10px] opacity-60">Security policies (X-Frame-Options) may prevent loading {url}. <br/>Actual browsing would use native rendering engine.</p>
       </div>
       <iframe 
         src={url}
         title="browser-content"
         className="w-full h-full bg-white transition-opacity duration-300"
       />
    </div>
  );
}

function ThemeBtn({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-full transition-all ${active ? 'bg-[var(--accent)] text-white shadow-lg scale-110' : 'opacity-40 hover:opacity-100 hover:bg-black/10'}`}
    >
      {icon}
    </button>
  );
}

function ToolbarBtn({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[var(--text-main)] opacity-70 hover:opacity-100 active:scale-90">
      {icon}
    </button>
  );
}

function SidebarItem({ active, onClick, icon, label }: { active?: boolean; onClick?: () => void; icon: React.ReactNode; label: string }) {
  return (
    <div className="group relative flex flex-col items-center gap-1 mb-6 cursor-pointer" onClick={onClick}>
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-[var(--accent)] text-white shadow-lg' : 'hover:bg-white/10 opacity-60'}`}>
        {icon}
      </div>
      <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-[10px] uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {label}
      </span>
      {active && <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-[var(--accent)] rounded-l-full" />}
    </div>
  );
}

const shortcuts = [
  { name: 'Google', url: 'https://www.google.com', icon: <Search size={24} /> },
  { name: 'Youtube', url: 'https://www.youtube.com', icon: <Monitor size={24} /> },
  { name: 'GitHub', url: 'https://github.com', icon: <Layers size={24} /> },
  { name: 'Gaming', url: 'https://poki.com', icon: <Gamepad2 size={24} /> },
];

function NotesWidget() {
  const [note, setNote] = React.useState('');
  return (
    <textarea 
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Capture a thought..."
      className="w-full h-full bg-transparent border-none outline-none resize-none font-medium text-sm leading-relaxed"
    />
  );
}

function CalcWidget() {
  const [val, setVal] = React.useState('');
  const btns = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
  
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-black/5 p-4 rounded-2xl text-right font-mono text-xl overflow-hidden truncate h-14 flex items-center justify-end">
        {val || '0'}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {btns.map(b => (
          <button 
            key={b}
            onClick={() => b === '=' ? setVal(eval(val).toString()) : setVal(val + b)}
            className="h-12 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 font-bold"
          >
            {b}
          </button>
        ))}
        <button onClick={() => setVal('')} className="col-span-4 h-10 mt-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-bold uppercase tracking-widest">Clear</button>
      </div>
    </div>
  );
}

function ChatWidget() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        <div className="p-3 bg-black/5 rounded-2xl text-xs leading-relaxed">
          Hello! I'm your Cozy Assistant. How can I help you browse today?
        </div>
      </div>
      <div className="h-10 bg-black/5 rounded-xl px-3 flex items-center gap-2">
        <input type="text" placeholder="Ask anything..." className="bg-transparent border-none outline-none text-xs flex-1" />
        <MessageCircle size={14} className="opacity-40" />
      </div>
    </div>
  );
}
