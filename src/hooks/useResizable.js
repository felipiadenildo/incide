import { useState, useCallback, useEffect, useRef } from 'react';

// 🔥 PARA PAINEL ESQUERDO (cresce para direita)
export function useResizableLeft(initialSize = 280, minSize = 200, maxSize = 600) {
  const [size, setSize] = useState(initialSize);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startSizeRef = useRef(initialSize);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startSizeRef.current = size;
    e.preventDefault();
  }, [size]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - startXRef.current;  // ← ESQUERDA: cresce para direita
    const newSize = Math.max(minSize, Math.min(maxSize, startSizeRef.current + delta));
    setSize(newSize);
  }, [minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { size, handleMouseDown };
}

// 🔥 PARA PAINEL DIREITO (cresce para esquerda)  
export function useResizableRight(initialSize = 280, minSize = 200, maxSize = 600) {
  const [size, setSize] = useState(initialSize);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startSizeRef = useRef(initialSize);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startSizeRef.current = size;
    e.preventDefault();
  }, [size]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const delta = startXRef.current - e.clientX;  // ← DIREITA: cresce para esquerda
    const newSize = Math.max(minSize, Math.min(maxSize, startSizeRef.current + delta));
    setSize(newSize);
  }, [minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { size, handleMouseDown };
}
