"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DataTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
  LoadingState,
  SectionCard,
} from "@/src/clinic-ui";

import { useCurrentUser } from "../../hooks/useCurrentUser";

import {
  getTeamMembers,
  TeamMember,
  updateMemberRole,
} from "../../services/client/teamApi";

import AddMemberDialog from "./AddMemberDialog";
import RemoveMemberDialog from "./RemoveMemberDialog";

export default function TeamPage() {
  const { user: currentUser } =
    useCurrentUser();

  const [members, setMembers] = useState<
    TeamMember[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [
    isAddDialogOpen,
    setIsAddDialogOpen,
  ] = useState(false);

  const [
    memberToRemove,
    setMemberToRemove,
  ] = useState<TeamMember | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getTeamMembers();

      setMembers(data);
      setError(null);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar a equipe."
      );

    } finally {

      setLoading(false);

    }
  }, []);

  useEffect(() => {
    // Busca única ao montar — padrão intencional de
    // "carregar dados ao montar".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleRoleChange(
    member: TeamMember,
    role: string
  ) {
    try {
      await updateMemberRole(
        member.id,
        role
      );

      toast.success(
        "Papel atualizado com sucesso."
      );

      load();

    } catch (err) {

      toast.error(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar papel."
      );

    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Carregando equipe..."
        description="Buscando os usuários com acesso à clínica."
      />
    );
  }

  if (error) {
    return (
      <SectionCard title="Equipe">
        <p className="text-sm text-destructive">
          {error}
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Equipe
          </h2>

          <p className="text-sm text-muted-foreground">
            Pessoas com acesso ao sistema
            desta clínica.
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() =>
            setIsAddDialogOpen(true)
          }
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <DataTable
        columns={
          <TableRow>
            <TableHeader>Nome</TableHeader>
            <TableHeader>E-mail</TableHeader>
            <TableHeader>Papel</TableHeader>
            <TableHeader
              className="text-right"
            >
              Ações
            </TableHeader>
          </TableRow>
        }
      >
        {members.map((member) => {
          const isSelf =
            member.id === currentUser?.id;

          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {member.name}

                  {isSelf && (
                    <StatusBadge status="Você" />
                  )}
                </div>
              </TableCell>

              <TableCell>
                {member.email}
              </TableCell>

              <TableCell>
                <Select
                  value={member.role}
                  onValueChange={(role) => {
                    if (!role) return;
                    handleRoleChange(
                      member,
                      role
                    );
                  }}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Dentista">
                      Dentista
                    </SelectItem>

                    <SelectItem value="Admin">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSelf}
                  onClick={() =>
                    setMemberToRemove(member)
                  }
                >
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdded={load}
      />

      <RemoveMemberDialog
        open={!!memberToRemove}
        onOpenChange={(open) => {
          if (!open)
            setMemberToRemove(null);
        }}
        member={memberToRemove}
        onRemoved={load}
      />

    </div>
  );
}
