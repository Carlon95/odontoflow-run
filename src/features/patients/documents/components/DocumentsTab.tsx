"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { LoadingState } from "@/src/clinic-ui";
import EmptyState from "@/src/clinic-ui/feedback/EmptyState";

import DocumentUploadForm from "./DocumentUploadForm";
import DocumentCard from "./DocumentCard";

import {
  getDocuments,
  deleteDocument,
} from "../services/client/documentApi";

import { PatientDocument } from "../types/document";

interface DocumentsTabProps {
  patientId: string;
}

export default function DocumentsTab({
  patientId,
}: DocumentsTabProps) {
  const [documents, setDocuments] = useState<
    PatientDocument[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] =
    useState<PatientDocument>();
  const [deleting, setDeleting] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await getDocuments(patientId);
      setDocuments(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar arquivos.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDocuments();
  }, [loadDocuments]);

  async function handleConfirmDelete() {
    if (!documentToDelete) return;

    try {
      setDeleting(true);

      await deleteDocument(
        patientId,
        documentToDelete.id
      );

      toast.success("Arquivo excluído.");

      setDocumentToDelete(undefined);
      await loadDocuments();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao excluir arquivo."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DocumentUploadForm
        patientId={patientId}
        onUploaded={loadDocuments}
      />

      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={(value) => {
          if (!value) setDocumentToDelete(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir {documentToDelete?.name}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Essa ação não pode ser desfeita. O arquivo
              será removido definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? (
        <LoadingState
          title="Carregando arquivos..."
          description="Buscando os documentos do paciente."
        />
      ) : documents.length === 0 ? (
        <EmptyState
          icon="📎"
          title="Nenhum arquivo ainda"
          description="Envie radiografias, fotos ou documentos usando o formulário acima."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={setDocumentToDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
