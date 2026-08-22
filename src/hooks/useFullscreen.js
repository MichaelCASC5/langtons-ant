import { useCallback, useEffect, useState } from "react";

// Wraps the browser Fullscreen API for a given element ref. This only
// works when the user interacts with it directly (browsers block
// programmatic fullscreen without a user gesture), which is fine since
// it's always triggered by a click.
export function useFullscreen(targetRef) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === targetRef.current);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, [targetRef]);

  const toggleFullscreen = useCallback(() => {
    if (!targetRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      targetRef.current.requestFullscreen().catch(() => {
        // Some browsers/contexts reject this silently (e.g. iframes
        // without the allowfullscreen attribute) — nothing to recover.
      });
    }
  }, [targetRef]);

  return { isFullscreen, toggleFullscreen };
}
