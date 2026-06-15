import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
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

// Forward ref wrapper for page content
const PageContent = ({ pageNumber, width, height }: { pageNumber: number; width: number; height: number }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
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
  const [dimensions, setDimensions] = useState({ width: 350, height: 500 });
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight || 600;
        
        // For book layout: each page is half the container width
        const pageWidth = Math.min(containerWidth / 2 - 20, 400);
        const pageHeight = Math.min(containerHeight - 80, pageWidth * 1.4);
        
        setDimensions({ width: pageWidth, height: pageHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isFullscreen]);

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
  };

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
    : "relative w-full bg-gradient-to-b from-stone-100 to-stone-200 rounded-xl overflow-hidden";

  return (
    <div className={containerClasses} ref={containerRef}>
      {/* Header bar */}
      <div className={`flex items-center justify-between w-full px-4 py-2 ${isFullscreen ? "max-w-4xl" : ""}`}>
        <h3 className={`font-serif font-semibold truncate ${isFullscreen ? "text-white text-lg" : "text-foreground text-sm"}`}>
          {title}
        </h3>
        <div className="flex items-center gap-1">
          <span className={`text-xs ${isFullscreen ? "text-white/70" : "text-muted-foreground"}`}>
            {currentPage + 1} / {numPages || "..."}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className={isFullscreen ? "text-white hover:bg-white/10" : ""}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={isFullscreen ? "text-white hover:bg-white/10" : ""}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Book container */}
      <div className={`flex items-center justify-center ${isFullscreen ? "flex-1 w-full max-w-4xl" : "py-4 min-h-[400px] sm:min-h-[500px]"}`}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading bulletin...</p>
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-sm text-muted-foreground">Unable to load PDF. Try downloading instead.</p>
            </div>
          }
        >
          {numPages > 0 && (
            <div className="flex items-center gap-2">
              {/* Prev button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrev}
                disabled={currentPage === 0}
                className={`shrink-0 ${isFullscreen ? "text-white hover:bg-white/10" : ""}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* @ts-ignore - react-pageflip types are incomplete */}
              <HTMLFlipBook
                ref={bookRef}
                width={dimensions.width}
                height={dimensions.height}
                size="stretch"
                minWidth={200}
                maxWidth={500}
                minHeight={300}
                maxHeight={700}
                showCover={true}
                mobileScrollSupport={false}
                onFlip={handleFlip}
                className="shadow-2xl"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={600}
                usePortrait={dimensions.width < 300}
                startZIndex={0}
                autoSize={true}
                maxShadowOpacity={0.5}
                showPageCorners={true}
                disableFlipByClick={false}
                swipeDistance={30}
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

              {/* Next button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={currentPage >= numPages - 1}
                className={`shrink-0 ${isFullscreen ? "text-white hover:bg-white/10" : ""}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </Document>
      </div>

      {/* Page dots indicator */}
      {numPages > 0 && numPages <= 20 && (
        <div className={`flex items-center justify-center gap-1 py-2 ${isFullscreen ? "" : "pb-4"}`}>
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentPage
                  ? isFullscreen ? "bg-white w-3" : "bg-primary w-3"
                  : isFullscreen ? "bg-white/30" : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
