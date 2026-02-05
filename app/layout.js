// credits : kasan
export const metadata = {
  title: 'Uploader',
  description: 'Secure File Upload',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#000' }}>{children}</body>
    </html>
  )
  }
