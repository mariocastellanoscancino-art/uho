import { UsuarioProvider } from '@/context/UsuarioContext';
import VacacionesPageContent from './page-content';

export default function VacacionesPage() {
  return (
    <UsuarioProvider>
      <VacacionesPageContent />
    </UsuarioProvider>
  );
}