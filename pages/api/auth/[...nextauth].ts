import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth';

if (process.env.NODE_ENV !== 'production'){
  console.log(authOptions);
}
export default NextAuth(authOptions);
