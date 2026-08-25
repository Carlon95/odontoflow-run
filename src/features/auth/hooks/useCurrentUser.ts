"use client";

import { useEffect, useState } from "react";

import { getCurrentUser } from "../services/client/authApi";
import { SafeUser } from "../types/user";

export function useCurrentUser() {
  const [user, setUser] =
    useState<SafeUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() =>
        setLoading(false)
      );
  }, []);

  return { user, loading };
}
