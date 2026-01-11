'use client';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Download, Image as ImageIcon, Plus, Settings, Text as TextIcon, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { ChangeEvent, MouseEvent } from 'react';

interface Watermark {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  opacity: number;
  rotate: number;
  fontSize?: number;
  color?: string;
  borderRadius?: number;
  // For sizing (in pixels, relative to preview container)
  width: number;
  height: number;
  // Original dimensions for image watermarks
  originalWidth?: number;
  originalHeight?: number;
}

interface UploadedImage {
  id: string;
  url: string;
  file: File;
  width: number;
  height: number;
}

type DragMode = 'move' | 'resize-se' | 'resize-sw' | 'resize-ne' | 'resize-nw' | null;

export function ImageWatermark() {
  const t = useTranslations('tools.image-watermark');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const [selectedWatermarkId, setSelectedWatermarkId] = useState<string | null>(null);
  const [isExportingAll, setIsExportingAll] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Drag state
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartWm, setDragStartWm] = useState<Watermark | null>(null);

  const currentImage = images[currentImageIndex];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            url,
            file,
            width: img.width,
            height: img.height,
          },
        ]);
      };
      img.src = url;
    });
  };

  const addTextWatermark = () => {
    const newWatermark: Watermark = {
      id: Math.random().toString(36).substring(7),
      type: 'text',
      content: 'Watermark',
      x: 50,
      y: 50,
      opacity: 0.8,
      rotate: 0,
      fontSize: 24,
      color: '#ffffff',
      borderRadius: 0,
      width: 120,
      height: 36,
    };
    setWatermarks((prev) => [...prev, newWatermark]);
    setSelectedWatermarkId(newWatermark.id);
  };

  const addImageWatermark = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Default size: max 150px width, keep aspect ratio
      const maxWidth = 150;
      const ratio = img.height / img.width;
      const width = Math.min(img.width, maxWidth);
      const height = width * ratio;

      const newWatermark: Watermark = {
        id: Math.random().toString(36).substring(7),
        type: 'image',
        content: url,
        x: 50,
        y: 50,
        opacity: 0.8,
        rotate: 0,
        borderRadius: 0,
        width,
        height,
        originalWidth: img.width,
        originalHeight: img.height,
      };
      setWatermarks((prev) => [...prev, newWatermark]);
      setSelectedWatermarkId(newWatermark.id);
    };
    img.src = url;
  };

  const updateWatermark = (id: string, updates: Partial<Watermark>) => {
    setWatermarks((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const removeWatermark = (id: string) => {
    setWatermarks((prev) => prev.filter((w) => w.id !== id));
    if (selectedWatermarkId === id) setSelectedWatermarkId(null);
  };

  const handleMouseDown = (e: MouseEvent, id: string, mode: DragMode = 'move') => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedWatermarkId(id);
    setDragMode(mode);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    const wm = watermarks.find((w) => w.id === id);
    if (wm) setDragStartWm({ ...wm });
  };

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!dragMode || !selectedWatermarkId || !containerRef.current || !dragStartWm) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;

      if (dragMode === 'move') {
        // Convert delta to percentage
        const percentX = (deltaX / rect.width) * 100;
        const percentY = (deltaY / rect.height) * 100;

        updateWatermark(selectedWatermarkId, {
          x: dragStartWm.x + percentX,
          y: dragStartWm.y + percentY,
        });
      } else {
        // Resize mode
        let newWidth = dragStartWm.width;
        let newHeight = dragStartWm.height;

        // Handle different corners
        if (dragMode === 'resize-se') {
          newWidth = Math.max(20, dragStartWm.width + deltaX);
          newHeight = Math.max(20, dragStartWm.height + deltaY);
        } else if (dragMode === 'resize-sw') {
          newWidth = Math.max(20, dragStartWm.width - deltaX);
          newHeight = Math.max(20, dragStartWm.height + deltaY);
        } else if (dragMode === 'resize-ne') {
          newWidth = Math.max(20, dragStartWm.width + deltaX);
          newHeight = Math.max(20, dragStartWm.height - deltaY);
        } else if (dragMode === 'resize-nw') {
          newWidth = Math.max(20, dragStartWm.width - deltaX);
          newHeight = Math.max(20, dragStartWm.height - deltaY);
        }

        updateWatermark(selectedWatermarkId, {
          width: newWidth,
          height: newHeight,
        });
      }
    },
    [dragMode, selectedWatermarkId, dragStartPos, dragStartWm]
  );

  const handleMouseUp = useCallback(() => {
    setDragMode(null);
    setDragStartWm(null);
  }, []);

  useEffect(() => {
    if (dragMode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragMode, handleMouseMove, handleMouseUp]);

  const drawCanvas = async (image: UploadedImage) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    canvas.width = image.width;
    canvas.height = image.height;

    // Get the preview container dimensions for scale calculation
    const previewRect = imageRef.current.getBoundingClientRect();
    const scaleX = image.width / previewRect.width;
    const scaleY = image.height / previewRect.height;

    // Draw main image
    const mainImg = new Image();
    mainImg.crossOrigin = 'anonymous';
    mainImg.src = image.url;
    await new Promise((resolve) => (mainImg.onload = resolve));
    ctx.drawImage(mainImg, 0, 0);

    // Draw watermarks
    for (const wm of watermarks) {
      ctx.save();
      ctx.globalAlpha = wm.opacity;

      const x = (wm.x / 100) * canvas.width;
      const y = (wm.y / 100) * canvas.height;

      ctx.translate(x, y);
      ctx.rotate((wm.rotate * Math.PI) / 180);

      const scaledWidth = wm.width * scaleX;
      const scaledHeight = wm.height * scaleY;

      if (wm.type === 'text') {
        const fontSize = (wm.fontSize || 24) * scaleX;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = wm.color || '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(wm.content, 0, 0);
      } else if (wm.type === 'image') {
        const wmImg = new Image();
        wmImg.crossOrigin = 'anonymous';
        wmImg.src = wm.content;
        await new Promise((resolve) => (wmImg.onload = resolve));

        // Apply border radius via clip if set
        if (wm.borderRadius && wm.borderRadius > 0) {
          const r = wm.borderRadius * scaleX;
          ctx.beginPath();
          ctx.roundRect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight, r);
          ctx.clip();
        }

        ctx.drawImage(wmImg, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
      }

      ctx.restore();
    }

    return canvas.toDataURL('image/png');
  };

  const handleExport = async () => {
    if (!currentImage) return;
    const dataUrl = await drawCanvas(currentImage);
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `watermarked-${currentImage.file.name.replace(/\.[^/.]+$/, '')}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleExportAll = async () => {
    if (!currentImage || images.length === 0 || isExportingAll) return;
    setIsExportingAll(true);
    try {
      const zip = new JSZip();
      const nameCounts = new Map<string, number>();

      for (const image of images) {
        const dataUrl = await drawCanvas(image);
        if (!dataUrl) continue;

        const response = await fetch(dataUrl);
        const blob = await response.blob();

        const baseName = image.file.name.replace(/\.[^/.]+$/, '');
        const fileName = `watermarked-${baseName}.png`;
        const count = (nameCounts.get(fileName) ?? 0) + 1;
        nameCounts.set(fileName, count);
        const uniqueName = count === 1 ? fileName : `watermarked-${baseName}-${count}.png`;

        zip.file(uniqueName, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'watermarked-images.zip');
    } finally {
      setIsExportingAll(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  if (images.length === 0) {
    return (
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <div className="flex flex-col items-center gap-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{t('ui.upload')}</h3>
            <p className="text-sm text-muted-foreground">{t('ui.dragHere')}</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedWatermark = watermarks.find((w) => w.id === selectedWatermarkId);

  // Resize handle component
  const ResizeHandle = ({ position, wmId }: { position: 'se' | 'sw' | 'ne' | 'nw'; wmId: string }) => {
    const positionClasses = {
      se: 'bottom-0 right-0 cursor-se-resize',
      sw: 'bottom-0 left-0 cursor-sw-resize',
      ne: 'top-0 right-0 cursor-ne-resize',
      nw: 'top-0 left-0 cursor-nw-resize',
    };
    const translateByPosition: Record<typeof position, string> = {
      se: 'translate(50%, 50%)',
      sw: 'translate(-50%, 50%)',
      ne: 'translate(50%, -50%)',
      nw: 'translate(-50%, -50%)',
    };

    return (
      <div
        className={`absolute w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${positionClasses[position]}`}
        style={{ transform: translateByPosition[position] }}
        onMouseDown={(e) => handleMouseDown(e, wmId, `resize-${position}` as DragMode)}
      />
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
      {/* Left Sidebar: Image List */}
      <div className="w-full lg:w-48 flex lg:flex-col gap-2 overflow-auto p-2 border rounded-lg bg-card">
        <Button variant="outline" className="lg:w-full shrink-0" onClick={() => fileInputRef.current?.click()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('ui.upload')}
        </Button>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`relative group flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 transition-colors ${
              idx === currentImageIndex ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => setCurrentImageIndex(idx)}
          >
            <img src={img.url} alt="thumbnail" className="w-16 h-16 lg:w-full lg:h-32 object-cover" />
            <button
              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(idx);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Area: Editor */}
      <div className="flex-1 bg-muted/30 rounded-lg flex items-center justify-center p-4 overflow-hidden relative border">
        {currentImage && (
          <div ref={containerRef} className="relative max-w-full max-h-full shadow-lg">
            <img
              ref={imageRef}
              src={currentImage.url}
              alt="preview"
              className="max-w-full max-h-[calc(100vh-250px)] block select-none pointer-events-none"
              draggable={false}
            />

            {/* Watermark Overlay Layer */}
            <div
              className="absolute inset-0"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedWatermarkId(null);
                }
              }}
            >
              {watermarks.map((wm) => (
                <div
                  key={wm.id}
                  className={`absolute cursor-move select-none group ${
                    selectedWatermarkId === wm.id ? 'ring-2 ring-primary ring-offset-1' : ''
                  }`}
                  style={{
                    left: `${wm.x}%`,
                    top: `${wm.y}%`,
                    width: `${wm.width}px`,
                    height: `${wm.height}px`,
                    transform: `translate(-50%, -50%) rotate(${wm.rotate}deg)`,
                    opacity: wm.opacity,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, wm.id, 'move')}
                >
                  {wm.type === 'text' ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        color: wm.color,
                        fontSize: `${wm.fontSize}px`,
                        whiteSpace: 'nowrap',
                        textShadow: '0 0 4px rgba(0,0,0,0.5)',
                        borderRadius: `${wm.borderRadius || 0}px`,
                        overflow: 'hidden',
                      }}
                    >
                      {wm.content}
                    </div>
                  ) : (
                    <img
                      src={wm.content}
                      alt="watermark"
                      className="w-full h-full object-contain"
                      style={{
                        borderRadius: `${wm.borderRadius || 0}px`,
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Resize handles - only show when selected */}
                  {selectedWatermarkId === wm.id && (
                    <>
                      <ResizeHandle position="se" wmId={wm.id} />
                      <ResizeHandle position="sw" wmId={wm.id} />
                      <ResizeHandle position="ne" wmId={wm.id} />
                      <ResizeHandle position="nw" wmId={wm.id} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Settings */}
      <div className="w-full lg:w-80 flex flex-col gap-4 border rounded-lg p-4 bg-card h-full overflow-auto">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {t('ui.settings')}
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={addTextWatermark}>
            <TextIcon className="mr-2 h-4 w-4" />
            {t('ui.addText')}
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('wm-image-upload')?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {t('ui.addImage')}
            </Button>
            <input id="wm-image-upload" type="file" accept="image/*" className="hidden" onChange={addImageWatermark} />
          </div>
        </div>

        {selectedWatermark ? (
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Properties</span>
              <Button variant="destructive" size="sm" onClick={() => removeWatermark(selectedWatermark.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {selectedWatermark.type === 'text' && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">{t('ui.content')}</label>
                <input
                  type="text"
                  value={selectedWatermark.content}
                  onChange={(e) => updateWatermark(selectedWatermark.id, { content: e.target.value })}
                  className="w-full bg-background border rounded px-2 py-1 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">{t('ui.fontSize')}</label>
                    <input
                      type="number"
                      value={selectedWatermark.fontSize}
                      onChange={(e) => updateWatermark(selectedWatermark.id, { fontSize: Number(e.target.value) })}
                      className="w-full bg-background border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t('ui.color')}</label>
                    <input
                      type="color"
                      value={selectedWatermark.color}
                      onChange={(e) => updateWatermark(selectedWatermark.id, { color: e.target.value })}
                      className="w-full bg-background border rounded h-[28px] px-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Size controls */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Size ({Math.round(selectedWatermark.width)} × {Math.round(selectedWatermark.height)})
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <input
                    type="number"
                    value={Math.round(selectedWatermark.width)}
                    onChange={(e) => updateWatermark(selectedWatermark.id, { width: Number(e.target.value) })}
                    className="w-full bg-background border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <input
                    type="number"
                    value={Math.round(selectedWatermark.height)}
                    onChange={(e) => updateWatermark(selectedWatermark.id, { height: Number(e.target.value) })}
                    className="w-full bg-background border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Border Radius ({selectedWatermark.borderRadius || 0}px)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedWatermark.borderRadius || 0}
                onChange={(e) => updateWatermark(selectedWatermark.id, { borderRadius: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {t('ui.opacity')} ({Math.round(selectedWatermark.opacity * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedWatermark.opacity}
                onChange={(e) => updateWatermark(selectedWatermark.id, { opacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {t('ui.rotate')} ({selectedWatermark.rotate}°)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedWatermark.rotate}
                onChange={(e) => updateWatermark(selectedWatermark.id, { rotate: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">{t('ui.x')}</label>
                <input
                  type="number"
                  value={Math.round(selectedWatermark.x)}
                  onChange={(e) => updateWatermark(selectedWatermark.id, { x: Number(e.target.value) })}
                  className="w-full bg-background border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t('ui.y')}</label>
                <input
                  type="number"
                  value={Math.round(selectedWatermark.y)}
                  onChange={(e) => updateWatermark(selectedWatermark.id, { y: Number(e.target.value) })}
                  className="w-full bg-background border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">Click a watermark to edit its properties</div>
        )}

        <div className="mt-auto border-t pt-4">
          <Button className="w-full" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t('ui.export')}
          </Button>
          <Button className="w-full mt-2" variant="secondary" onClick={handleExportAll} disabled={isExportingAll}>
            <Download className="mr-2 h-4 w-4" />
            {t('ui.exportAll')}
          </Button>
          <Button variant="ghost" className="w-full mt-2" onClick={() => setWatermarks([])}>
            {t('ui.clear')}
          </Button>
        </div>
      </div>
    </div>
  );
}
