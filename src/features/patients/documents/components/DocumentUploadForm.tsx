"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField } from "@/src/clinic-ui";

import { uploadDocument } from "../services/client/documentApi";
import { DOCUMENT_CATEGORIES } from "../types/document";

interface DocumentUploadFormProps {
  patientId: string;
  onUploaded: () => void;
}

export default function DocumentUploadForm({
  patientId,
  onUploaded,
}: DocumentUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Documento");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = e.target.files?.[0] ?? null;

    setFile(selected);

    if (selected && !name) {
      setName(selected.name.replace(/\.[^/.]+$/, ""));
    }
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Selecione um arquivo.");
      return;
    }

    try {
      setUploading(true);

      await uploadDocument(
        patientId,
        file,
        name || file.name,
        category
      );

      toast.success("Arquivo enviado com sucesso.");

      setFile(null);
      setName("");
      setCategory("Documento");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploaded();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao enviar arquivo."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="shadow-elegant rounded-xl border bg-card p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
        <FormField label="Arquivo">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
        </FormField>

        <FormField label="Nome de exibição">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Radiografia panorâmica"
          />
        </FormField>

        <FormField label="Categoria">
          <Select
            value={category}
            onValueChange={(value) =>
              setCategory(value ?? "Documento")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {DOCUMENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="flex items-end">
          <Button
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Imagens ou PDF, até 4MB por arquivo.
      </p>
    </div>
  );
}
