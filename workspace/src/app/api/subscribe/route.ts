import { currentRole, currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");


// const session = await currentRole();

export async function GET() {
    try {
        console.log("GET /api/subscribe");
        const user = await currentUser();
        const userId = user?.id;
        console.log("userId", userId);
        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userSubscription = await db.userSubscription.findUnique({
            where: {
                userId
            }
        })

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            })

            return new NextResponse(JSON.stringify({ url: stripeSession.url }))
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: 'tejas@gmail.com',
            line_items: [
                {
                    price_data: {
                        currency: "INR",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        })

        return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

