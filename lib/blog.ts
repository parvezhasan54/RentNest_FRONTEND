export interface BlogPost {
  slug: string; title: string; excerpt: string; date: string;
  readMinutes: number; category: string; image: string; body: string[];
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

export const posts: BlogPost[] = [
  {
    slug: "how-to-read-a-rental-listing",
    title: "How to read a rental listing like a pro",
    excerpt: "Five things to check before you send a request, from price to photos.",
    date: "2026-10-12", readMinutes: 4, category: "Renters",
    image: img("1502672260266-1c1ef2d93688"),
    body: [
      "Start with the price and what it includes. Check whether utilities, parking or amenities such as a gym or pool are part of the monthly rent, because the same number can mean very different things between two listings.",
      "Look closely at the photos and the location. Multiple photos of every room are a good sign. Use the map on the listing page to check the commute and what's nearby before you fall in love with the unit.",
      "Finally, check the availability date and read reviews from past tenants. If a listing is marked unavailable you can still save it and come back later.",
    ],
  },
  {
    slug: "photos-that-get-more-requests",
    title: "Landlords: photos that get more rental requests",
    excerpt: "Simple photo habits that make your listing stand out.",
    date: "2026-10-05", readMinutes: 3, category: "Landlords",
    image: img("1560448204-e02f11c3d0e2"),
    body: [
      "Shoot in daylight with the lights on and the curtains open. Natural light makes rooms look larger and cleaner than any filter.",
      "Show every room, plus the entrance and the building's shared spaces. Tenants want to know what a day in the home looks like, and they trust listings that hide nothing.",
      "Put your best photo first. It becomes the cover image on listing cards, so it decides whether someone clicks through.",
    ],
  },
  {
    slug: "how-payments-work-on-rentnest",
    title: "How payments work on RentNest",
    excerpt: "From approval to your first month's rent, step by step.",
    date: "2026-09-28", readMinutes: 3, category: "Payments",
    image: img("1568605114967-8130f3a36994"),
    body: [
      "You can't pay until a landlord approves your request. Once it's approved, a Pay button appears next to the request in your dashboard.",
      "Clicking it opens Stripe Checkout, where you pay your first month's rent. Your card details go straight to Stripe, so RentNest never sees them.",
      "After a successful payment your rental becomes active, and your payment shows up in your payment history with its transaction ID.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);