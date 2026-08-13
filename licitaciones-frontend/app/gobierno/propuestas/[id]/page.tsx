import PropuestaDetalle from "../../../components/PropuestaDetalle";

export const metadata = { title: "Detalle de propuesta" };

export default async function GobiernoPropuestaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropuestaDetalle proposalId={id} />;
}
