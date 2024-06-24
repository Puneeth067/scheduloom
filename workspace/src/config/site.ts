
const site_url = process.env.NEXT_PUBLIC_APP_URL;

export const siteConfig = {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Next js Starter",
    description:
        "Get your project off to an explosive start with SaaS Starter! Harness the power of Next.js 14, Prisma, Planetscale, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
    url: site_url || "http://localhost:3000",
    ogImage: `${site_url}/og.jpg`,
    links: {
        twitter: "https://twitter.com/tejasgk250",
        github: "https://github.com/tejas-gk",
    },
    mailSupport: "support@saas-starter.com"
}
