import IntegracionSimpleFirebase from "@/components/IntegracionSimpleFirebase";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Integración Firebase Vacaciones | uholidays3",
  description: "Integración del sistema de vacaciones con Firebase uholidays3",
};

export default function FirebaseIntegracionPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <IntegracionSimpleFirebase />
    </div>
  );
}