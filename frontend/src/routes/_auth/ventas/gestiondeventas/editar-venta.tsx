import { createFileRoute } from '@tanstack/react-router';
import SalesEdit from '../../../../pages/ventas/SalesEdit';

export const Route = createFileRoute('/_auth/ventas/gestiondeventas/editar-venta')({
  component: SalesEditPage
});

function SalesEditPage() {
  return <SalesEdit />;
}