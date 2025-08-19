import PropertyDetailClient from "./PropertyDetailClient";

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <PropertyDetailClient id={id} />;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  
  return {
    title: `Property ${id} · Properties`,
    description: `Detalle de la propiedad ${id}`,
  };
}
