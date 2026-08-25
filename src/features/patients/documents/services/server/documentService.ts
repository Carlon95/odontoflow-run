import { put, del } from "@vercel/blob";

import {
  findByPatientId,
  findById,
  create,
  remove,
} from "../../repositories/documentRepository";

// Uploads via esta rota passam pelo corpo da requisição da própria
// função serverless — a Vercel limita isso (4.5MB no plano Hobby).
// Arquivos maiores exigiriam o fluxo de upload direto do navegador
// do @vercel/blob (client upload), fora do escopo desta primeira
// versão.
export const MAX_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;

export async function getPatientDocuments(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function uploadPatientDocument(params: {
  patientId: string;
  file: File;
  name: string;
  category: string;
  uploadedById?: string;
}) {
  const { patientId, file, name, category, uploadedById } =
    params;

  const blob = await put(
    `patients/${patientId}/${Date.now()}-${file.name}`,
    file,
    {
      access: "public",
      addRandomSuffix: true,
    }
  );

  return create({
    patientId,
    name,
    category,
    url: blob.url,
    blobPath: blob.pathname,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    uploadedById,
  });
}

export async function deletePatientDocument(id: string) {
  const document = await findById(id);

  if (!document) {
    throw new Error("Arquivo não encontrado.");
  }

  await remove(id);

  // Se o blob já não existir por algum motivo, ignora o erro —
  // o registro no banco já foi removido, que é o que importa
  // pra experiência do usuário.
  try {
    await del(document.blobPath);
  } catch (error) {
    console.error(
      "Erro ao excluir arquivo do Vercel Blob:",
      error
    );
  }

  return document;
}
