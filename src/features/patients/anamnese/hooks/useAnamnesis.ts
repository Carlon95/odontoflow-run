"use client";

import { useEffect, useState } from "react";

import { getAnamnesis } from "../services/anamnesisApi";
import { Anamnesis } from "../types/anamnesis";

export function useAnamnesis(
  patientId: string
) {
  const [anamnesis, setAnamnesis] =
    useState<Anamnesis | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getAnamnesis(patientId);

        setAnamnesis(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    }

    load();

  }, [patientId]);

  return {
    anamnesis,
    loading,
  };
}