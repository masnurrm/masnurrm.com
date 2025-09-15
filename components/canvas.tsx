'use client';
import { IconCheck, IconTrash, IconDownload } from '@/components/ui/icons';
import { useCallback, useRef, useState } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import html2canvas from 'html2canvas';

const colorList = [
  'rgba(255, 187, 0, 0.6)',
  'rgba(0, 255, 187, 0.6)',
  'rgba(187, 0, 255, 0.6)',
  'rgba(0, 187, 255, 0.6)',
  'rgba(255, 0, 187, 0.6)',
];

export default function Canvas() {
  const [color, setColor] = useState('rgba(255, 187, 0, 0.6)');
  const canvasRef = useRef(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleClear = useCallback(() => {
    //@ts-expect-error ReactSketchCanvas ref type is not properly defined
    canvasRef.current.clearCanvas();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (paletteRef.current) {
        paletteRef.current.style.display = 'none';
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const sectionElement = document.querySelector('section');
      if (!sectionElement) return;

      const isDarkMode = document.documentElement.classList.contains('dark');

      const canvas = await html2canvas(sectionElement, {
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      if (paletteRef.current) {
        paletteRef.current.style.display = 'block';
      }

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'doodle-bareng-masnurrm.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to save page:', error);
      if (paletteRef.current) {
        paletteRef.current.style.display = 'block';
      }
    }
  }, []);

  return (
    <>
      <ReactSketchCanvas
        ref={canvasRef}
        canvasColor="transparent"
        style={{
          position: 'fixed',
          top: '58px',
          zIndex: 10,
        }}
        strokeWidth={5}
        strokeColor={color}
      />
      <div
        ref={paletteRef}
        className="fixed bottom-12 left-1/2 z-20 -translate-x-1/2 rounded-full bg-accent p-2"
      >
        <div className="flex flex-row space-x-2">
          {colorList.map((data, key) => (
            <button
              onClick={() => setColor(data)}
              className="size-7 rounded-full"
              key={key}
              style={{ backgroundColor: data }}
              aria-label="Change brush color"
            >
              {data === color && <IconCheck className="m-auto size-5" />}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="size-7 rounded-full bg-border"
            aria-label="Clear doodle"
          >
            <IconTrash className="m-auto size-4" />
          </button>
          <button
            onClick={handleSave}
            className="size-7 rounded-full bg-border"
            aria-label="Save page with doodle"
          >
            <IconDownload className="m-auto size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
