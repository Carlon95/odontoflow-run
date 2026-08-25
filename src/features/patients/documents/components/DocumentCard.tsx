"use client";

import {
  FileImage,
  FileText,
  Download,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PatientDocument } from "../types/document";

interface DocumentCardProps {
  document: PatientDocument;
  onDelete: (document: PatientDocument) => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const CATEGORY_CLASSES: Record<string, string> = {
  Radiografia: "bg-primary/8 text-primary",
  Foto: "bg-sky-50 text-sky-700",
  Exame: "bg-amber-50 text-amber-700",
  Documento: "bg-slate-100 text-slate-600",
};

export default function DocumentCard({
  document,
  onDelete,
}: DocumentCardProps) {
  const isImage = document.mimeType.startsWith("image/");

  return (
    <div className="shadow-elegant shadow-elegant-hover group overflow-hidden rounded-xl border bg-card">
      <a
        href={document.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-[4/3] w-full overflow-hidden bg-muted/30"
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={document.url}
            alt={document.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            {document.mimeType === "application/pdf" ? (
              <FileText className="h-10 w-10" />
            ) : (
              <FileImage className="h-10 w-10" />
            )}
            <span className="text-xs font-medium uppercase">
              {document.mimeType.split("/")[1] ?? "arquivo"}
            </span>
          </div>
        )}
      </a>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p
            className="truncate text-sm font-medium"
            title={document.name}
          >
            {document.name}
          </p>

          <Badge
            variant="secondary"
            className={`shrink-0 text-[10px] ${CATEGORY_CLASSES[document.category] ?? CATEGORY_CLASSES.Documento}`}
          >
            {document.category}
          </Badge>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {formatSize(document.size)}
          {document.uploadedBy && (
            <> · {document.uploadedBy.name}</>
          )}
        </p>

        <div className="mt-2 flex items-center justify-end gap-1">
          <Button
            render={
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                download
              />
            }
            variant="ghost"
            size="icon"
            className="h-7 w-7"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete(document)}
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
