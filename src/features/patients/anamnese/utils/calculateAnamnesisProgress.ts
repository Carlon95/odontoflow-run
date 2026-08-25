import { Anamnesis } from "../types/anamnesis";

export function calculateAnamnesisProgress(
  anamnesis: Anamnesis | null
) {
  if (!anamnesis) return 0;

  const textFields = [
    anamnesis.chiefComplaint,
    anamnesis.medicalConditions,
    anamnesis.medications,
    anamnesis.allergies,
    anamnesis.previousSurgeries,
    anamnesis.dentalHistory,
    anamnesis.oralHygieneHabits,
    anamnesis.observations,
  ];

  const filledTextFields = textFields.filter(
    (field) =>
      field &&
      field.trim().length > 0
  ).length;

  const booleanFields = [
    anamnesis.isPregnant,
    anamnesis.isSmoker,
    anamnesis.hasBruxism,
  ];

  const filledBooleanFields =
    booleanFields.filter(
      (field) =>
        field !== null &&
        field !== undefined
    ).length;

  const filledLastVisit = anamnesis.lastDentalVisit
    ? 1
    : 0;

  const totalFields =
    textFields.length +
    booleanFields.length +
    1;

  const filled =
    filledTextFields +
    filledBooleanFields +
    filledLastVisit;

  return Math.round(
    (filled / totalFields) * 100
  );
}
