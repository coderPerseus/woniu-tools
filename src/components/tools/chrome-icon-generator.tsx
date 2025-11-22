'use client';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ArrowDownToLine, Loader2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { DragEvent, FormEvent } from 'react';

const DEFAULT_SIZES = [32, 48, 64, 96, 128, 256, 512] as const;

type MaybeFile = File | null | undefined;

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

async function canvasToBlob(img: HTMLImageElement, size: number, filter?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas not supported.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (filter) {
    ctx.filter = filter;
  }

  ctx.drawImage(img, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

  if (!blob) throw new Error('Unable to generate PNG blob.');

  return blob;
}

export function ChromeIconGenerator() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [sizes, setSizes] = useState<number[]>([...DEFAULT_SIZES]);

  const processFile = useCallback(async (file: MaybeFile) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = typeof e.target?.result === 'string' ? e.target.result : null;
      if (!src) return;
      try {
        const img = await loadImage(src);
        setPreviewSrc(src);
        setImageSize({ width: img.width, height: img.height });
      } catch {
        alert('图片加载失败，请重试。');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!previewSrc) return;
    setIsProcessing(true);

    try {
      const baseImage = await loadImage(previewSrc);
      const zip = new JSZip();

      for (const size of sizes) {
        const blob = await canvasToBlob(baseImage, size);
        zip.file(`icon-${size}.png`, blob);
      }

      const darkFolder = zip.folder('dark');
      for (const size of sizes) {
        const blob = await canvasToBlob(baseImage, size, 'invert(100%) hue-rotate(180deg)');
        darkFolder?.file(`icon-${size}.png`, blob);
      }

      const svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${baseImage.width} ${baseImage.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image width="${baseImage.width}" height="${baseImage.height}" xlink:href="${baseImage.src}"/></svg>`;
      zip.file('toolbar-icon.svg', svgContent);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'icons-bundle-pro.zip');
    } catch (error) {
      console.error(error);
      alert('生成图片时出错，请确认已上传有效的图片文件。');
    } finally {
      setIsProcessing(false);
    }
  }, [previewSrc, sizes]);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      void processFile(file);
    },
    [processFile]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleAddSize = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const value = Number(customSize);
      if (!Number.isFinite(value) || value <= 0) {
        alert('请输入有效的尺寸（正整数）');
        return;
      }
      setSizes((prev) => (prev.includes(value) ? prev : [...prev, value].sort((a, b) => a - b)));
      setCustomSize('');
    },
    [customSize]
  );

  return (
    <div className="space-y-10">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg">
        <div className="p-8">
          <div
            className={`relative flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
              isDragging ? 'border-primary/70 bg-primary/5' : 'border-border/60 bg-muted/40'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={(e) => {
                void processFile(e.target.files?.[0]);
                // 允许上传同一文件时再次触发 change
                e.target.value = '';
              }}
            />

            <div className="pointer-events-none flex flex-col items-center text-center">
              <div className="mb-4 inline-flex rounded-full bg-background p-4 shadow-sm">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <p className="text-xl font-semibold text-foreground">点击或拖拽大图到这里</p>
              <p className="mt-2 text-sm text-muted-foreground">建议上传 512x512 以上的 PNG 文件以获得最佳效果</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              生成尺寸：
              <span className="ml-1 font-semibold text-foreground">{sizes.join(', ')}</span>
            </div>
            <form className="flex items-center gap-2" onSubmit={handleAddSize}>
              <input
                type="number"
                min={16}
                step={1}
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="自定义尺寸 (px)"
                className="h-10 w-40 rounded-md border border-border bg-background px-3 text-sm outline-none ring-0 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" size="sm" variant="secondary" className="gap-1">
                <Plus className="h-4 w-4" />
                添加尺寸
              </Button>
            </form>
          </div>
        </div>
      </div>

      {previewSrc ? (
        <div className="animate-[fadeIn_0.5s_ease-out] rounded-2xl border border-border/60 bg-card shadow-lg p-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex shrink-0 gap-4">
              <div className="space-y-2 text-center">
                <p className="text-xs font-medium text-muted-foreground">标准模式预览</p>
                <div className="inline-block rounded-xl border border-border/70 bg-muted/50 p-2">
                  <Image
                    src={previewSrc}
                    alt="Light preview"
                    width={128}
                    height={128}
                    unoptimized
                    className="h-32 w-32 object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs font-medium text-muted-foreground">Dark 模式预览 (自动反色)</p>
                <div className="inline-block rounded-xl border border-border/80 bg-slate-900 p-2 shadow-inner">
                  <Image
                    src={previewSrc}
                    alt="Dark preview"
                    width={128}
                    height={128}
                    unoptimized
                    className="dark-mode-filter h-32 w-32 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-border/60 bg-muted/30 p-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                  ✓
                </span>
                准备生成内容
              </h3>

              <div className="mb-6 grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-2">
                <div>
                  <h4 className="mb-1 font-semibold text-foreground">标准尺寸 (根目录)</h4>
                  <ul className="space-y-1 text-muted-foreground/90">
                    {sizes.map((size) => (
                      <li key={`light-${size}`}>icon-{size}.png</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-foreground">Dark 模式 (/dark 目录)</h4>
                  <ul className="space-y-1 text-muted-foreground/90">
                    <li>全套反色 PNG 图标（同上尺寸）</li>
                  </ul>
                  <h4 className="mt-3 mb-1 font-semibold text-foreground">其他</h4>
                  <ul className="space-y-1 text-muted-foreground/90">
                    <li>toolbar-icon.svg</li>
                  </ul>
                </div>
              </div>

              <Button
                className="w-full text-base font-semibold"
                size="lg"
                disabled={isProcessing}
                onClick={() => void handleGenerate()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在处理图像...
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="mr-2 h-5 w-5" />
                    打包下载所有图标 (.zip)
                  </>
                )}
              </Button>

              {imageSize ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  原始尺寸：{imageSize.width} x {imageSize.height}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .dark-mode-filter {
          filter: invert(100%) hue-rotate(180deg);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
