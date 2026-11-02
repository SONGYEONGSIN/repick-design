"use client";

import { useEffect, useState } from "react";

/** True only after the client has mounted -- avoids an animated-from-hidden flash on first paint. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
