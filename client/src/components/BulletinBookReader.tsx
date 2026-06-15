import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft, ChevronRight, X, Maximize2, Minimize2,
  ZoomIn, ZoomOut, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BulletinBookReaderProps {
  pdfUrl: string;
  title: string;
  onClose?: () => void;
}

export default function BulletinBookReader({ pdfUrl, title, onClose }: BulletinBookReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [pageWidth, setPageWidth] = useState(350);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Calculate page width to fill container
  useEffect(() => {
    const updateWidth = () => {
      if (isFullscreen) {
        setPageWidth(Math.min(window.innerWidth - 32, 900));
      } else if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth - 24);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isFullscreen]);

  // Keyboard navigation in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goToPrev();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") goToNext();
      else if (e.key === "Escape") setIsFullscreen(false);
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, currentPage, numPages]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(numPages, p + 1));

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3.0));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const resetZoom = () => setZoom(1.0);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsFullscreen(!isFullscreen);
    setZoom(1.0);
  };

  // Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  // Navigation bar
  const NavControls = ({ dark = false }: { dark?: boolean }) => (
    <div className={`flex items-center justify-between gap-2 ${dark ? "text-white" : "text-foreground"}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPrev}
        disabled={currentPage <= 1}
        className={`h-9 w-9 p-0 shrink-0 ${dark ? "text-white hover:bg-white/10 disabled:opacity-20" : "disabled:opacity-30"}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <span className={`text-sm tabular-nums ${dark ? "text-white/80" : "text-muted-foreground"}`}>
        Page {currentPage} of {numPages || "..."}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={goToNext}
        disabled={currentPage >= numPages}
        className={`h-9 w-9 p-0 shrink-0 ${dark ? "text-white hover:bg-white/10 disabled:opacity-20" : "disabled:opacity-30"}`}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  // Loading component
  const LoadingState = ({ dark = false }: { dark?: boolean }) => (
    <div className="flex items-center justify-center h-[300px]">
      <div className="text-center">
        <div className={`w-8 h-8 border-2 ${dark ? "border-white border-t-transparent" : "border-primary border-t-transparent"} rounded-full animate-spin mx-auto mb-2`} />
        <p className={`text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>Loading bulletin...</p>
      </div>
    </div>
  );

  // Error component
  const ErrorState = ({ dark = false }: { dark?: boolean }) => (
    <div className="flex items-center justify-center h-[300px]">
      <div className="text-center">
        <p className={`text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>
          Unable to load PDF.
        </p>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm text-primary underline mt-2 inline-block">
          Download instead
        </a>
      </div>
    </div>
  );

  // Fullscreen overlay — rendered via portal to escape any parent stacking context
  const FullscreenOverlay = () => (
    <div
      className="fixed inset-0 bg-neutral-900 flex flex-col"
      style={{ zIndex: 99999 }}
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-black/80 backdrop-blur-sm border-b border-white/10 shrink-0 safe-area-top">
        <h3 className="font-serif font-semibold truncate text-white text-sm flex-1 mr-3">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoom <= 0.5}
            className="text-white hover:bg-white/10 disabled:opacity-30 h-8 w-8 p-0" title="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <button onClick={resetZoom}
            className="text-xs text-white/70 hover:text-white tabular-nums min-w-[2.5rem] text-center">
            {zoomPercent}%
          </button>
          <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoom >= 3.0}
            className="text-white hover:bg-white/10 disabled:opacity-30 h-8 w-8 p-0" title="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm"
              className="text-white hover:bg-white/10 h-8 w-8 p-0" title="Download PDF">
              <Download className="w-4 h-4" />
            </Button>
          </a>

          <Button variant="ghost" size="sm" onClick={toggleFullscreen}
            className="text-white hover:bg-white/10 h-8 w-8 p-0" title="Exit full screen">
            <Minimize2 className="w-4 h-4" />
          </Button>

          {onClose && (
            <Button variant="ghost" size="sm" onClick={() => { setIsFullscreen(false); onClose(); }}
              className="text-white hover:bg-white/10 h-8 w-8 p-0" title="Close">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main reading area */}
      <div
        className="flex-1 overflow-auto flex items-start justify-center py-4 px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LoadingState dark />}
          error={<ErrorState dark />}
        >
          {numPages > 0 && (
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
              <Page
                pageNumber={currentPage}
                width={pageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />
            </div>
          )}
        </Document>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 bg-black/80 backdrop-blur-sm border-t border-white/10 px-4 py-2 safe-area-bottom">
        <NavControls dark />
      </div>
    </div>
  );

  // Inline (non-fullscreen) view
  return (
    <>
      {/* Portal fullscreen overlay */}
      {isFullscreen && createPortal(<FullscreenOverlay />, document.body)}

      <div ref={containerRef} className="relative w-full bg-stone-50 rounded-xl overflow-hidden border border-border/40">
        {/* Header with prominent fullscreen button */}
        <div className="flex items-center justify-between w-full px-3 sm:px-4 py-2.5 border-b border-border/40 bg-white/80">
          <h3 className="font-serif font-semibold truncate text-foreground text-sm flex-1 mr-2">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download PDF">
                <Download className="w-4 h-4" />
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}
              title="Full screen" className="h-8 w-8 p-0">
              <Maximize2 className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* PDF page - full width */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<LoadingState />}
            error={<ErrorState />}
          >
            {numPages > 0 && (
              <div className="flex items-center justify-center">
                <Page
                  pageNumber={currentPage}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            )}
          </Document>
        </div>

        {/* Bottom nav + fullscreen CTA */}
        {numPages > 0 && (
          <div className="border-t border-border/40 bg-white/80 px-3 py-2">
            <NavControls />
            {/* Prominent fullscreen button for mobile */}
            <div className="sm:hidden mt-2">
              <button
                onClick={toggleFullscreen}
                className="w-full py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center justify-center gap-2 active:bg-primary/20 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Open Full Screen Reader
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
