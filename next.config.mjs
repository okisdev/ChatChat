import withPWAInit from '@ducanh2912/next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
    dest: 'public',
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPWA(withNextIntl(nextConfig));
