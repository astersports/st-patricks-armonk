import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import {
  ChevronLeft, ChevronRight, X, Maximize2, Minimize2,
  ZoomIn, ZoomOut, RotateCcw,
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

const ZOOM_LEVELS = [0.6, 0.75, 0.9, 1.0, 1.15, 1.3, 1.5, 1.75, 2.0];
const DEFAULT_ZOOM_INDEX = 3; // 1.0x

// Forward ref wrapper for page content
const PageContent = ({ pageNumber, width, height }: { pageNumber: number; width: number; height: number }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
      <Page
        pageNumber={pageNumber}
        width={width}
        height={height}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  );
};

export default function BulletinBookReader({ pdfUrl, title, onClose }: BulletinBookReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [dimensions, setDimensions] = useState({ width: 350, height: 500 });
  const [isMobile, setIsMobile] = useState(false);
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate dimensions based on container and zoom
  useEffect(() => {
    const updateDimensions = () => {
      const container = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight || 600;

      if (isMobile || isFullscreen) {
        // Single page portrait mode on mobile / fullscreen uses full width
        const maxWidth = isFullscreen ? containerWidth - 80 : containerWidth - 40;
        const pageWidth = Math.min(maxWidth, 500) * zoom;
        const pageHeight = Math.min(containerHeight - 100, pageWidth * 1.4) * zoom;
        setDimensions({ width: pageWidth, height: pageHeight });
      } else {
        // Desktop: book spread (two pages side by side)
        const pageWidth = Math.min(containerWidth / 2 - 30, 400) * zoom;
        const pageHeight = Math.min(containerHeight - 100, pageWidth * 1.4) * zoom;
        setDimensions({ width: pageWidth, height: pageHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isFullscreen, zoom, isMobile]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setIsFullscreen(false);
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, currentPage, numPages, zoomIndex]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const goToPrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const goToNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Reset zoom when toggling
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  };

  const zoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  };

  const zoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };

  const resetZoom = () => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  };

  const zoomPercent = Math.round(zoom * 100);

  // Inline (non-fullscreen) view
  if (!isFullscreen) {
    return (
      <div className="relative w-full bg-gradient-to-b from-stone-100 to-stone-200 rounded-xl overflow-hidden" ref={containerRef}>
        {/* Header bar */}
        <div className="flex items-center justify-between w-full px-4 py-2.5 border-b border-stone-200/60">
          <h3 className="font-serif font-semibold truncate text-foreground text-sm flex-1 mr-2">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">
              {currentPage + 1} / {numPages || "..."}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              title="Full screen (better reading on mobile)"
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Book container */}
        <div className="flex items-center justify-center py-4 min-h-[350px] sm:min-h-[450px]">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-[350px]">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading bulletin...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-[350px]">
                <p className="text-sm text-muted-foreground">Unable to load PDF. Try downloading instead.</p>
              </div>
            }
          >
            {numPages > 0 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPrev}
                  disabled={currentPage === 0}
                  className="shrink-0 h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* @ts-ignore - react-pageflip types are incomplete */}
                <HTMLFlipBook
                  ref={bookRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  size="stretch"
                  minWidth={150}
                  maxWidth={500}
                  minHeight={200}
                  maxHeight={700}
                  showCover={true}
                  mobileScrollSupport={false}
                  onFlip={handleFlip}
                  className="shadow-2xl"
                  style={{}}
                  startPage={0}
                  drawShadow={true}
                  flippingTime={500}
                  usePortrait={isMobile}
                  startZIndex={0}
                  autoSize={true}
                  maxShadowOpacity={0.4}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  swipeDistance={20}
                  clickEventForward={true}
                  useMouseEvents={true}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <div key={i} className="bg-white">
                      <PageContent
                        pageNumber={i + 1}
                        width={dimensions.width}
                        height={dimensions.height}
                      />
                    </div>
                  ))}
                </HTMLFlipBook>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage >= numPages - 1}
                  className="shrink-0 h-8 w-8 p-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </Document>
        </div>

        {/* Footer: page dots + fullscreen hint on mobile */}
        <div className="pb-3 px-4">
          {numPages > 0 && numPages <= 20 && (
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: numPages }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentPage ? "bg-primary w-3" : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          )}
          {isMobile && (
            <p className="text-center text-xs text-muted-foreground">
              <button onClick={toggleFullscreen} className="text-primary font-medium hover:underline">
                Tap for full screen
              </button>{" "}
              for a better reading experience
            </p>
          )}
        </div>
      </div>
    );
  }

  // Fullscreen view
  return (
    <div
      ref={fullscreenContainerRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
      style={{ touchAction: "none" }}
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-black/80 backdrop-blur-sm border-b border-white/10 shrink-0">
        <h3 className="font-serif font-semibold truncate text-white text-sm sm:text-base flex-1 mr-3">
          {title}
        </h3>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Page indicator */}
          <span className="text-xs sm:text-sm text-white/70 mr-2 tabular-nums">
            {currentPage + 1} / {numPages || "..."}
          </span>
          {/* Minimize */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/10 h-8 w-8 p-0"
            title="Exit full screen"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          {/* Close */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setIsFullscreen(false); onClose(); }}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
              title="Close reader"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main reading area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-white/70">Loading bulletin...</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-white/70">Unable to load PDF. Try downloading instead.</p>
            </div>
          }
        >
          {numPages > 0 && (
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Prev */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrev}
                disabled={currentPage === 0}
                className="text-white hover:bg-white/10 disabled:opacity-20 h-10 w-10 p-0 shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Book */}
              <div className="overflow-auto max-h-full max-w-full flex items-center justify-center">
                {/* @ts-ignore - react-pageflip types are incomplete */}
                <HTMLFlipBook
                  ref={bookRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  size="stretch"
                  minWidth={200}
                  maxWidth={800}
                  minHeight={280}
                  maxHeight={1000}
                  showCover={true}
                  mobileScrollSupport={false}
                  onFlip={handleFlip}
                  className="shadow-2xl"
                  style={{}}
                  startPage={currentPage}
                  drawShadow={true}
                  flippingTime={500}
                  usePortrait={isMobile}
                  startZIndex={0}
                  autoSize={true}
                  maxShadowOpacity={0.6}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  swipeDistance={20}
                  clickEventForward={true}
                  useMouseEvents={true}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <div key={i} className="bg-white">
                      <PageContent
                        pageNumber={i + 1}
                        width={dimensions.width}
                        height={dimensions.height}
                      />
                    </div>
                  ))}
                </HTMLFlipBook>
              </div>

              {/* Next */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={currentPage >= numPages - 1}
                className="text-white hover:bg-white/10 disabled:opacity-20 h-10 w-10 p-0 shrink-0"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </Document>
      </div>

      {/* Bottom toolbar: zoom controls + page dots */}
      <div className="shrink-0 bg-black/80 backdrop-blur-sm border-t border-white/10 px-3 sm:px-5 py-2.5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              disabled={zoomIndex === 0}
              className="text-white hover:bg-white/10 disabled:opacity-30 h-8 w-8 p-0"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <button
              onClick={resetZoom}
              className="text-xs text-white/70 hover:text-white tabular-nums min-w-[3rem] text-center transition-colors"
              title="Reset zoom"
            >
              {zoomPercent}%
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              className="text-white hover:bg-white/10 disabled:opacity-30 h-8 w-8 p-0"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              className="text-white/50 hover:bg-white/10 hover:text-white h-8 w-8 p-0 ml-1"
              title="Reset to 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Page dots (compact for fullscreen) */}
          {numPages > 0 && numPages <= 20 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: numPages }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === currentPage ? "bg-white w-2.5 h-2" : "bg-white/25 w-1.5 h-1.5"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Keyboard hint (desktop only) */}
          <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-xs">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[10px]">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[10px]">→</kbd>
            <span>navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
