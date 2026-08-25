import {
  countByRole,
  findAll,
  findById,
  remove,
  update,
} from "../../repositories/userRepository";

export async function getTeamMembers() {
  return findAll();
}

export async function removeMember(
  id: string,
  currentUserId: string
) {
  if (id === currentUserId) {
    throw new Error(
      "Você não pode remover sua própria conta."
    );
  }

  const member = await findById(id);

  if (!member) {
    throw new Error(
      "Usuário não encontrado."
    );
  }

  if (member.role === "Admin") {
    const adminCount = await countByRole(
      "Admin"
    );

    if (adminCount <= 1) {
      throw new Error(
        "Não é possível remover o único administrador da clínica."
      );
    }
  }

  return remove(id);
}

export async function updateMemberRole(
  id: string,
  role: string,
  currentUserId: string
) {
  const member = await findById(id);

  if (!member) {
    throw new Error(
      "Usuário não encontrado."
    );
  }

  if (
    member.role === "Admin" &&
    role !== "Admin"
  ) {
    const adminCount = await countByRole(
      "Admin"
    );

    if (adminCount <= 1) {
      throw new Error(
        "Não é possível rebaixar o único administrador da clínica."
      );
    }
  }

  if (
    id === currentUserId &&
    role !== "Admin"
  ) {
    throw new Error(
      "Você não pode remover seu próprio acesso de administrador."
    );
  }

  return update(id, { role });
}
