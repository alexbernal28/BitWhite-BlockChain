import LicitacionDetalle from "../../../components/LicitacionDetalle";

export const metadata = { title: "Detalle de licitación" };

export default async function GobiernoLicitacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LicitacionDetalle tenderId={id} />;
}
