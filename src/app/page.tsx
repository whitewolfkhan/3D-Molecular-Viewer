"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom,
  Github,
  Menu,
  X,
  Minimize2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MoleculeSelector from "@/components/molecule/MoleculeSelector";
import ControlPanel from "@/components/molecule/ControlPanel";
import InfoPanel from "@/components/molecule/InfoPanel";
import ExportControls from "@/components/molecule/ExportControls";
import { useMoleculeStore } from "@/lib/molecules/store";
import { Button } from "@/components/ui/button";

// Dynamically import the 3D viewer to avoid SSR issues
const MoleculeViewer = dynamic(
  () => import("@/components/molecule/MoleculeViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <Atom className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400" />
          </div>
          <span className="text-white/60 text-sm">Loading 3D Engine...</span>
        </div>
      </div>
    ),
  },
);

export default function Home() {
  const { currentMolecule, isFullscreen, toggleFullscreen, theme } =
    useMoleculeStore();
  const [resetTrigger, setResetTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<"controls" | "info">(
    "info",
  );

  const handleReset = useCallback(() => {
    useMoleculeStore.getState().resetView();
    setResetTrigger((prev) => prev + 1);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleToggleInfoPanel = useCallback(() => {
    setInfoPanelOpen((prev) => !prev);
  }, []);

  const handleExitFullscreen = useCallback(() => {
    if (isFullscreen) {
      toggleFullscreen();
    }
  }, [isFullscreen, toggleFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        handleExitFullscreen();
      } else if ((e.key === "f" || e.key === "F") && !isFullscreen) {
        toggleFullscreen();
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen, handleReset, isFullscreen, handleExitFullscreen]);

  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-slate-950" : "bg-slate-100"}`}
    >
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-1/2 -left-1/2 w-full h-full ${theme === "dark" ? "bg-cyan-500/5" : "bg-cyan-500/10"} rounded-full blur-3xl`}
        />
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-full h-full ${theme === "dark" ? "bg-purple-500/5" : "bg-purple-500/10"} rounded-full blur-3xl`}
        />
      </div>

      {/* Fullscreen Mode */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950"
          >
            {/* Fullscreen Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center gap-2 sm:gap-4">
                {currentMolecule && (
                  <motion.div
                    key={currentMolecule.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-2 sm:px-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl font-bold text-white">
                        {currentMolecule.formula}
                      </span>
                      <span className="text-white/40">|</span>
                      <span className="text-xs sm:text-sm text-white/60 hidden sm:inline">
                        {currentMolecule.name}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <ExportControls />
                <button
                  onClick={handleExitFullscreen}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="text-xs sm:text-sm hidden sm:inline">
                    Exit
                  </span>
                </button>
              </div>
            </div>

            {/* 3D Viewer */}
            <Suspense fallback={null}>
              <MoleculeViewer resetTrigger={resetTrigger} />
            </Suspense>

            {/* Fullscreen Help */}
            <div className="absolute bottom-4 left-4 z-10">
              <div className="px-3 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/40">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span>🖱️ Drag to rotate</span>
                  <span>🔍 Scroll to zoom</span>
                  <span>⌨️ [ESC] Exit</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal Mode */}
      {!isFullscreen && (
        <>
          {/* Header */}
          <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl flex-shrink-0">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between gap-2">
                {/* Logo */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <Atom className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-base sm:text-lg font-bold text-white">
                      MolViz 3D
                    </h1>
                    <p className="text-xs text-white/40">
                      Molecular Structure Viewer
                    </p>
                  </div>
                </div>

                {/* Molecule Selector - Desktop */}
                <div className="flex-1 max-w-md lg:max-w-xl hidden md:block">
                  <MoleculeSelector />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <ExportControls />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm hidden sm:flex"
                  >
                    <Maximize2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </Button>
                </div>
              </div>

              {/* Mobile Molecule Selector */}
              <div className="mt-2 md:hidden">
                <MoleculeSelector />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 relative z-10 flex overflow-hidden">
            {/* Left Sidebar - Controls - Desktop */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="hidden lg:block overflow-y-auto border-r border-white/10 bg-white/5 backdrop-blur-xl flex-shrink-0"
                >
                  <div className="p-4 w-[280px]">
                    <ControlPanel />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Sidebar Toggle - Desktop */}
            <button
              onClick={handleToggleSidebar}
              className="hidden lg:flex items-center justify-center w-6 bg-white/5 hover:bg-white/10 border-r border-white/10 text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* 3D Viewer */}
            <div className="flex-1 relative min-w-0">
              {/* Molecule Title Overlay - Desktop */}
              {currentMolecule && (
                <div className="absolute top-4 left-4 z-10 hidden sm:block">
                  <motion.div
                    key={currentMolecule.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-2 sm:px-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl font-bold text-white">
                        {currentMolecule.formula}
                      </span>
                      <span className="text-white/40">|</span>
                      <span className="text-xs sm:text-sm text-white/60">
                        {currentMolecule.name}
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Help Overlay */}
              <div className="absolute bottom-16 sm:bottom-4 left-4 z-10">
                <div className="px-3 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/40">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span>🖱️ Drag</span>
                    <span>🔍 Zoom</span>
                    <span className="hidden sm:inline">[F] Full</span>
                  </div>
                </div>
              </div>

              {/* 3D Viewer */}
              <Suspense
                fallback={
                  <div className="w-full h-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        <Atom className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                      </div>
                      <span className="text-white/60 text-sm">
                        Loading 3D Engine...
                      </span>
                    </div>
                  </div>
                }
              >
                <MoleculeViewer resetTrigger={resetTrigger} />
              </Suspense>
            </div>

            {/* Info Panel Toggle - Desktop */}
            <button
              onClick={handleToggleInfoPanel}
              className="hidden lg:flex items-center justify-center w-6 bg-white/5 hover:bg-white/10 border-l border-white/10 text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
              {infoPanelOpen ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Right Sidebar - Info - Desktop */}
            <AnimatePresence>
              {infoPanelOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="hidden lg:block overflow-y-auto border-l border-white/10 bg-white/5 backdrop-blur-xl flex-shrink-0"
                >
                  <div className="p-4 w-[320px]">
                    <InfoPanel />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl flex-shrink-0">
            <div className="flex">
              <button
                onClick={() => setActiveMobileTab("controls")}
                className={`flex-1 p-3 sm:p-4 text-center transition-colors ${
                  activeMobileTab === "controls"
                    ? "text-cyan-400 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Menu className="w-5 h-5" />
                  <span className="text-xs">Controls</span>
                </div>
              </button>
              <button
                onClick={() => setActiveMobileTab("info")}
                className={`flex-1 p-3 sm:p-4 text-center transition-colors ${
                  activeMobileTab === "info"
                    ? "text-cyan-400 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Atom className="w-5 h-5" />
                  <span className="text-xs">Info</span>
                </div>
              </button>
              <button
                onClick={toggleFullscreen}
                className="flex-1 p-3 sm:p-4 text-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col items-center gap-1">
                  <Maximize2 className="w-5 h-5" />
                  <span className="text-xs">Fullscreen</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Side Panels */}
          <AnimatePresence>
            {activeMobileTab === "controls" && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-0 right-0 bottom-14 z-30 max-h-[70vh] bg-slate-950 border-t border-white/10 overflow-y-auto rounded-t-2xl"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Controls
                    </h3>
                    <button
                      onClick={() => setActiveMobileTab("info")}
                      className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <ControlPanel />
                </div>
              </motion.div>
            )}

            {activeMobileTab === "info" && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed left-0 right-0 bottom-14 z-30 max-h-[70vh] bg-slate-950 border-t border-white/10 overflow-y-auto rounded-t-2xl"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Molecule Info
                    </h3>
                    <button
                      onClick={() => setActiveMobileTab("controls")}
                      className="p-2 rounded-lg bg-white/10 text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <InfoPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer - Desktop Only */}
          <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-xl hidden lg:block flex-shrink-0">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <Atom className="w-4 h-4" />
                  <span>MolViz 3D - Interactive Molecular Visualization</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
