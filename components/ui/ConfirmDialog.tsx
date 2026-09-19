"use client";

import Button, { type ButtonVariant } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "Batal",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} description={description} size="sm">
      {children ? <div className="mb-5 text-sm text-slate-600">{children}</div> : null}
      <div className="flex flex-col-reverse gap-3 pb-2 sm:pb-0 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} data-autofocus className="w-full sm:w-auto">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
