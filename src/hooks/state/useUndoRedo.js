import { useAppStore } from "../store/useAppStore";

export function useUndoRedo() {
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);
  const reset = useAppStore((s) => s.reset);

  return { undo, redo, reset };
}
