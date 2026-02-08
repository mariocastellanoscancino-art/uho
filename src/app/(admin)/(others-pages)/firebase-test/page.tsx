import type { Metadata } from "next";
import FirebaseTestDetailed from "@/components/FirebaseTestDetailed";
import React from "react";

export const metadata: Metadata = {
  title: "Diagnóstico Firebase | Sistema de Vacaciones",
  description: "Página para diagnosticar problemas de conexión con Firebase",
};

export default function FirebaseTestPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🔥 Diagnóstico Firebase
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Diagnóstico paso a paso para resolver problemas de conexión
        </p>
      </div>

      {/* Componente de diagnóstico */}
      <FirebaseTestDetailed />

      {/* Guía rápida de soluciones */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-300">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
            🚨 Si aparecen errores:
          </h3>
          <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
            <li>• Verifica que el proyecto "uholidays2" existe en Firebase Console</li>
            <li>• Habilita Firestore Database en Firebase Console</li>
            <li>• Configura reglas permisivas temporalmente</li>
            <li>• Verifica tu conexión a internet</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-300">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            ✅ Si funciona correctamente:
          </h3>
          <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
            <li>• Firebase está configurado correctamente</li>
            <li>• Puedes proceder a integrar con tu sistema de vacaciones</li>
            <li>• Considera implementar reglas de seguridad más específicas</li>
            <li>• Configura autenticación si es necesario</li>
          </ul>
        </div>
      </div>
    </div>
  );
}