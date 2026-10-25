"use client";

import Link from "next/link";
import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
} from "react-icons/fa6";
import { Logo } from "@/components/shared/Logo";
import { Mail, MapPin, Phone } from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";
import { SITE } from "@/lib/site";


const renters = [
    { label: "Browse Listings", href: "/properties" },
    { label: "Saved Homes", href: "/dashboard/tenant/saved" },
    { label: "Rent Payments", href: "/dashboard/tenant/payment/history" },
    { label: "Help Center", href: "/help" },
];

const landlords = [
    { label: "List a Property", href: "/dashboard/landlord/properties/create" },
    { label: "Owner Dashboard", href: "/dashboard/landlord" },
    { label: "Manage Requests", href: "/dashboard/landlord/requests" },
    { label: "Landlord Tips", href: "/blog" },
];

const company = [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Help", href: "/help" },
];

const socials = [
    { label: "Facebook", href: SITE.socials.facebook, Icon: FaFacebookF },
    { label: "X", href: SITE.socials.x, Icon: FaXTwitter },
    { label: "Instagram", href: SITE.socials.instagram, Icon: FaInstagram },
    { label: "LinkedIn", href: SITE.socials.linkedin, Icon: LiaLinkedin },
];

export default function Footer() {
    return (
        <footer className="border-t bg-background mt-20">
            <div className="container mx-auto max-w-7xl px-6 py-20">
                <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    {/* Left */}
                    <div>
                        <Logo />

                        <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
                            Discover verified rental properties, trusted landlords,
                            transparent pricing, and seamless online booking—all in one
                            modern platform.
                        </p>

                        <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-primary" />
                                New York, United States
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-primary" />
                                hello@rentnest.com
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-primary" />
                                +1 (800) 123-4567
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            {socials.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="rounded-full border p-2 transition hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Renters */}
                    <div>
                        <h4 className="font-semibold">Renters</h4>

                        <ul className="mt-6 space-y-4">
                            {renters.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground transition hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Landlords */}
                    <div>
                        <h4 className="font-semibold">Landlords</h4>

                        <ul className="mt-6 space-y-4">
                            {landlords.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground transition hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold">Company</h4>

                        <ul className="mt-6 space-y-4">
                            {company.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground transition hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}

                <div className="mt-16 flex flex-col gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} RentNest. All rights reserved.
                    </p>

                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-primary">
                            Privacy Policy
                        </Link>

                        <Link href="#" className="hover:text-primary">
                            Terms of Service
                        </Link>

                        <Link href="#" className="hover:text-primary">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}