"use client";

import { useEffect } from "react";

interface UseAutoSaveProps<T> {
  values: T;
  delay?: number;
  onSave: (values: T) => Promise<void>;
}

export function useAutoSave<T>({
  values,
  delay = 2000,
  onSave,
}: UseAutoSaveProps<T>) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave(values);
    }, delay);

    return () => clearTimeout(timeout);
  }, [values, delay, onSave]);
}