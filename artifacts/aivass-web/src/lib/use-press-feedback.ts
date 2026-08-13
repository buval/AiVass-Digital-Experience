import { useEffect, useRef, useState } from "react";

/**
 * Transient pressed/working feedback for links that open a new tab
 * (Stripe checkout, sample PDFs). Returns whether the given key is
 * currently "pressed" and a trigger to press it for `duration` ms.
 */
export function usePressFeedback(duration = 2500) {
  const [pressed, setPressed] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function press(key: string) {
    setPressed(key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPressed(null), duration);
  }

  return { isPressed: (key: string) => pressed === key, press };
}
