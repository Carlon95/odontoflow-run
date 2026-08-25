"use client";

import { useEffect, useState } from "react";

import { getTreatmentPlan } from "../services/treatmentPlanApi";
import { TreatmentPlan } from "../types/treatmentPlan";

export function useTreatmentPlan(
  patientId: string
) {
  const [treatmentPlan, setTreatmentPlan] =
    useState<TreatmentPlan | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getTreatmentPlan(patientId);

        setTreatmentPlan(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    }

    load();

  }, [patientId]);

  return {
    treatmentPlan,
    loading,
  };
}
