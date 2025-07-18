import { createFileRoute } from '@tanstack/react-router';
import SalesCreate from '../../../../pages/ventas/sales/SalesCreate';

export const Route = createFileRoute('/_auth/ventas/gestiondeventas/añadir-venta')({
  component: AgregarVentaPage
});

function AgregarVentaPage() {
  return <SalesCreate />;
}