
import type { ReactNode } from "react";

export const metadata = {
  title: "SatuAI",
  description: "Ақылды AI бизнес көмекші",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="kk">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
