    // middleware.ts
    import { NextResponse } from 'next/server';

    export const config = {
        matcher:[
            'check'
        ]
    }


    export function middleware(request) {
     
      const isAuthenticated =false

      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      
      return NextResponse.next();
    }