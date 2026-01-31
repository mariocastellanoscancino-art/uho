import { Metadata } from "next";
import { UsuarioProvider } from "@/context/UsuarioContext";

export const metadata: Metadata = {
  title: "Gestión de Vacaciones | TailAdmin - Dashboard de Administración",
  description:
    "Sistema completo de gestión de vacaciones para empleados con seguimiento de solicitudes y aprobaciones",
};

export default function VacacionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsuarioProvider>
      {children}
    </UsuarioProvider>
  );
}