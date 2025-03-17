import {withAuth} from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl;

                const publicRoutes = ["/", "/auth/login", "/auth/register"];
                if(publicRoutes.includes(pathname)){
                    return true;
                }

                return !!token;
            }
        }
    }
)

export const config = {
    matcher: [
      "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};