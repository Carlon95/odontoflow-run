export interface AnamnesisStatus {
  label: string;
  color: string;
}

export function getAnamnesisStatus(
  progress: number
): AnamnesisStatus {

  if (progress === 0) {
    return {
      label: "Não iniciada",
      color: "text-red-500",
    };
  }

  if (progress < 50) {
    return {
      label: "Em andamento",
      color: "text-orange-500",
    };
  }

  if (progress < 100) {
    return {
      label: "Quase concluída",
      color: "text-blue-500",
    };
  }

  return {
    label: "Completa",
    color: "text-green-600",
  };
}