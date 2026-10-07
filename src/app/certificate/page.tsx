import type { Metadata } from "next";
import { CertificateView } from "@/components/certificate-view";

export const metadata: Metadata = { title: "Certificate" };

export default function CertificatePage() {
  return <CertificateView />;
}
