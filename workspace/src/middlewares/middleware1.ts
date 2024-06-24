import {
    NextResponse,
    type NextFetchEvent,
    type NextRequest
} from 'next/server'
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
// import {
//     DEFAULT_LOGIN_REDIRECT,
//     apiAuthPrefix,
//     authRoutes,
//     publicRoutes,
// } from "@/routes";

import { CustomMiddleware } from './chain'

const { auth } = NextAuth(authConfig);

export function withMiddleware1(middleware: CustomMiddleware) {
    return auth((req) => {
    })
}


