import "./globals.css";
import "./public.css";

export const metadata = {
  title: "SafeTalkAI",
  description:
    "AI-Based Multilingual Social Media Threat and Sentiment Analysis System",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}