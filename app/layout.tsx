import '@/styles/globals.css';
import '@/styles/markdown.css';
import 'tippy.js/dist/tippy.css';

import { rubik } from '@/app/fonts';

import { Providers } from '@/app/providers';

import { HotToaster } from '@/components/client/toaster';
import { ClientCommand } from '@/components/client/command';

import { siteConfig } from '@/config/site.config';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html className={`${rubik.className}`} lang='en'>
            <head>
                <title>{siteConfig.title}</title>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' />
                <meta name='description' content={siteConfig.description} />

                <meta name='application-name' content={siteConfig.title} />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <meta name='apple-mobile-web-app-status-bar-style' content='default' />
                <meta name='apple-mobile-web-app-title' content={siteConfig.title} />
                <meta name='description' content={siteConfig.title + '-' + siteConfig.description} />
                <meta name='format-detection' content='telephone=no' />
                <meta name='mobile-web-app-capable' content='yes' />
                <meta name='msapplication-config' content='/icons/browserconfig.xml' />
                <meta name='msapplication-TileColor' content='#2B5797' />
                <meta name='msapplication-tap-highlight' content='no' />
                <meta name='theme-color' content='#eee' />

                <link rel='manifest' href='/manifest.json' />
                <link rel='icon' type='image/png' href='/favicon.ico' />
                <link rel='shortcut icon' type='image/png' href='/favicon.ico' />
                <link rel='apple-touch-icon' href='/icons/apple-touch-icon.png' />
                <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
                <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
                <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' />

                <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
                <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
                <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
                <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
                <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
                <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
                <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />

                <script
                    defer
                    src='https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.js'
                    integrity='sha384-JRVVAdBKoQa7uhd8heKqlQyzByQCC57fpvrCw9iSahjP5bLB5b+hX0klEdjZmsH6'
                    crossOrigin='anonymous'
                />
            </head>

            <body className='min-h-screen bg-slate-50 dark:bg-[#323233] dark:text-[#eee]'>
                <Providers>
                    <HotToaster />
                    <ClientCommand />

                    {children}
                </Providers>
            </body>
        </html>
    );
}
