import { createFileRoute } from '@tanstack/react-router';
import SalesCreate from '../../../../pages/ventas/SalesCreate';

export const Route = createFileRoute('/_auth/ventas/gestiondeventas/añadir-venta')({
  component: AgregarVentaPage
});

function AgregarVentaPage() {
  return <SalesCreate />;
}