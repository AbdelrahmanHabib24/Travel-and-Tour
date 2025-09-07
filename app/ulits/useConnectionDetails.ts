import { useCallback, useEffect, useState } from "react";
import { ConnectionDetails } from "@/app/api/connection-details/route";

export default function useConnectionDetails() {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);

  const fetchConnectionDetails = useCallback(async () => {
    try {
      setConnectionDetails(null);

      const endpoint = process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details";
      const url = `${window.location.origin}${endpoint}`;

      const res = await fetch(url);
      const data = await res.json();

      setConnectionDetails(data);
    } catch (error) {
      console.error("Error fetching connection details:", error);
    }
  }, []);

  useEffect(() => {
    fetchConnectionDetails();
  }, [fetchConnectionDetails]);

  return { connectionDetails, refreshConnectionDetails: fetchConnectionDetails };
}
