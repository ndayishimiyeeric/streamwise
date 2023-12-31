"use client";

import { useEffect, useState } from "react";

import UserSettings from "./user-settings";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <UserSettings />
    </>
  );
};

export default ModalProvider;
