export const metadata = {
  title: "SimpleStart AI",
  description: "AI that gets you clients, automates the rest.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "Inter, Manrope, Poppins, system-ui",
          margin: 0,
          background: "#F7F9FA",
          color: "#001E3C",
        }}
      >
        {children}
      </body>
    </html>
  );
}

