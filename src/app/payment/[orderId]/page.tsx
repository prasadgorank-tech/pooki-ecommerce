import PaymentClient from "./PaymentClient";

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  return <PaymentClient orderId={resolvedParams.orderId} />;
}
