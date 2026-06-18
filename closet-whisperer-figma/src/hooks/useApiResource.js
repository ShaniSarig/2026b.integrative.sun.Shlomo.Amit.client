import { useEffect, useState } from "react";

export function useApiResource(fetcher, fallbackValue, dependencies = []) {
  const [data, setData] = useState(fallbackValue);
  const [loading, setLoading] = useState(Boolean(fetcher));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fetcher) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setData(fallbackValue);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error, setData };
}
