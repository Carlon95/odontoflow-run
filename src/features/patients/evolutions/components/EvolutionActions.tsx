import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface EvolutionActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EvolutionActions({
  onEdit,
  onDelete,
}: EvolutionActionsProps) {
  return (
    <div className="flex justify-end gap-2">

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4 sm:mr-2" />

        <span className="hidden sm:inline">
          Editar
        </span>
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 sm:mr-2" />

        <span className="hidden sm:inline">
          Excluir
        </span>
      </Button>

    </div>
  );
}