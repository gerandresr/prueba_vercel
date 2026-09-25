import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trading Desk Dashboard",
  description: "Dashboard ejecutivo de resultados, posiciones y límites de trading",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
