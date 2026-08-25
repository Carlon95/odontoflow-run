import { SafeUser } from "../../types/user";

export interface TeamMember extends SafeUser {
  createdAt: string;
}

export async function getTeamMembers() {
  const response = await fetch("/api/team");

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao carregar a equipe."
    );
  }

  return response.json() as Promise<
    TeamMember[]
  >;
}

export async function updateMemberRole(
  id: string,
  role: string
) {
  const response = await fetch(
    `/api/team/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao atualizar usuário."
    );
  }

  return response.json();
}

export async function removeMember(
  id: string
) {
  const response = await fetch(
    `/api/team/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.message ||
        "Erro ao remover usuário."
    );
  }
}
