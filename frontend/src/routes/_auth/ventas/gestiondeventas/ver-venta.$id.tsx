import { createFileRoute } from '@tanstack/react-router';
import SalesView from '../../../../pages/ventas/SalesView';

export const Route = createFileRoute('/_auth/ventas/gestiondeventas/ver-venta/$id')({
  component: SalesViewPage
});

function SalesViewPage() {
  return <SalesView/>;
}