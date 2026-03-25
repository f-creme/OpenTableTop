// components/Transitions.tsx

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function NavbarTransition({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); 
    return () => setVisible(false); 
  }, []);

  return (
    <div
      style={{
        transition: "opacity 2s ease, transform 2s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  );
}
