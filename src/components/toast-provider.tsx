"use client";

import { Toaster } from "react-hot-toast";

import React, { useEffect, useState } from "react";

function ToastProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isMounted) return null;
  return <Toaster />;
}

export default ToastProvider;
