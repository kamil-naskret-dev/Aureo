import { useRef, useState, DragEvent } from 'react';

type DragHandlers = {
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
};

type UseFileDrop = {
  isDragging: boolean;
  dragHandlers: DragHandlers;
};

export const useFileDrop = (onFile: (file: File) => void): UseFileDrop => {
  const [isDragging, setIsDragging] = useState(false);
  const counterRef = useRef(0);

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    counterRef.current++;
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    counterRef.current--;
    if (counterRef.current === 0) setIsDragging(false);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    counterRef.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return { isDragging, dragHandlers: { onDragEnter, onDragLeave, onDragOver, onDrop } };
};
