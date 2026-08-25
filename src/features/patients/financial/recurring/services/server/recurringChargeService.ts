import {
  create,
  findAllActive,
  findByPatientId,
  remove,
  setActive,
  update,
} from "../../repositories/recurringChargeRepository";

import { create as createFinancialEntry, existsForRecurringChargeInMonth } from "../../../repositories/financialEntryRepository";

export async function getRecurringCharges(
  patientId: string
) {
  return findByPatientId(patientId);
}

export async function createRecurringCharge(data: {
  patientId: string;
  description: string;
  amount: number;
  dayOfMonth: number;
}) {
  return create(data);
}

export async function updateRecurringCharge(
  id: string,
  data: {
    description: string;
    amount: number;
    dayOfMonth: number;
  }
) {
  return update(id, data);
}

export async function toggleRecurringCharge(
  id: string,
  active: boolean
) {
  return setActive(id, active);
}

export async function deleteRecurringCharge(
  id: string
) {
  return remove(id);
}

function lastDayOfMonth(
  year: number,
  month: number
) {
  return new Date(
    year,
    month + 1,
    0
  ).getDate();
}

/**
 * Roda diariamente (via cron): para cada cobrança recorrente
 * ativa, verifica se já passou do dia do mês configurado e se
 * ainda não foi gerada uma cobrança para o mês atual — se não,
 * cria. É "recuperável": se o cron não rodar num dia específico,
 * ele ainda gera na próxima execução, sem duplicar.
 */
export async function generateDueCharges() {
  const charges = await findAllActive();

  const now = new Date();

  let generated = 0;

  for (const charge of charges as {
    id: string;
    patientId: string;
    description: string;
    amount: number;
    dayOfMonth: number;
  }[]) {
    const targetDay = Math.min(
      charge.dayOfMonth,
      lastDayOfMonth(
        now.getFullYear(),
        now.getMonth()
      )
    );

    const dueDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      targetDay
    );

    if (now < dueDate) continue;

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const alreadyGenerated =
      await existsForRecurringChargeInMonth(
        charge.id,
        monthStart,
        monthEnd
      );

    if (alreadyGenerated) continue;

    await createFinancialEntry({
      patientId: charge.patientId,
      description: charge.description,
      amount: charge.amount,
      date: dueDate,
      recurringChargeId: charge.id,
    });

    generated++;
  }

  return { generated, total: charges.length };
}
