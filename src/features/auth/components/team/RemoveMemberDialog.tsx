"use client";

import { useState } from "react";
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

import { removeMember } from "../../services/client/teamApi";
import { TeamMember } from "../../services/client/teamApi";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onRemoved: () => void;
}

export default function RemoveMemberDialog({
  open,
  onOpenChange,
  member,
  onRemoved,
}: RemoveMemberDialogProps) {
  const [isRemoving, setIsRemoving] =
    useState(false);

  async function handleRemove() {
    if (!member) return;

    try {
      setIsRemoving(true);

      await removeMember(member.id);

      toast.success(
        "Usuário removido com sucesso."
      );

      onOpenChange(false);
      onRemoved();

    } catch (error) {

      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao remover usuário."
      );

    } finally {

      setIsRemoving(false);

    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Remover {member?.name}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Esta pessoa perderá o acesso ao
            sistema imediatamente. Essa ação
            não pode ser desfeita.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel
            disabled={isRemoving}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
          >
            {isRemoving
              ? "Removendo..."
              : "Remover"}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}
