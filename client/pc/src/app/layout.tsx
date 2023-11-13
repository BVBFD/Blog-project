import type { Metadata } from 'next';
import { didot } from 'src/common/font/font';
import './globals.css';
import { ThemeContextProvider } from 'src/common/context/ThemeContext';
import { homeMeta } from 'src/common/meta/meta';

import { PopUpProvider } from 'src/common/context/UsePopUp';

import Navbar from '../components/Navbar/Navbar';

export const metadata: Metadata = homeMeta;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={didot.className}>
        <ThemeContextProvider>
          <PopUpProvider>
            <div className="container">
              <Navbar />
              {children}
            </div>
          </PopUpProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
