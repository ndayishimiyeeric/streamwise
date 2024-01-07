"use client";

import React, { useEffect, useState } from "react";

import Modal from "@/components/ui/modal";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal className="max-w-3xl" title="Upgrade your plan" isOpen={isOpen} onClose={onClose}>
      <div className="grid sm:grid-cols-2">Ugrade model</div>
    </Modal>
  );
}

export default UpgradeModal;
