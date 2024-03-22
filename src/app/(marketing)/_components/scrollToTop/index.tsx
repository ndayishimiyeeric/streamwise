"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[99]">
      {isVisible && (
        <div
          onClick={scrollToTop}
          aria-label="scroll to top"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-md transition duration-300 ease-in-out hover:bg-primary/90 hover:shadow-xl"
        >
          <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t"></span>
          <span className="sr-only">scroll to top</span>
        </div>
      )}
    </div>
  );
}
