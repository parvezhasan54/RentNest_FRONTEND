import LegalPage from "@/components/shared/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Terms of Service | RentNest" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The rules for using RentNest as a tenant or a landlord."
      updated="October 25, 2026"
      sections={[
        { heading: "Using RentNest", body: [
          "You must provide accurate information when you register and keep your login details private. You are responsible for activity on your account.",
          "RentNest is a marketplace. We connect tenants and landlords but are not a party to the rental agreement between them.",
        ]},
        { heading: "Listings", body: [
          "Landlords must only list properties they are entitled to rent, and must keep price, photos, availability and descriptions accurate.",
          "We may take down or remove listings that are misleading, unlawful or reported as fraudulent.",
        ]},
        { heading: "Requests and payments", body: [
          "A rental request is not a booking. A landlord may approve or reject it. Approved requests can be paid through Stripe Checkout.",
          "Payments are processed by Stripe and subject to their terms. Contact us promptly about any payment problem.",
        ]},
        { heading: "Reviews", body: [
          "Only tenants who have completed payment for a property may review it. Reviews must be honest and must not contain abuse or personal data.",
        ]},
        { heading: "Account suspension", body: [
          "We may suspend or ban accounts that violate these terms, attempt fraud, or abuse other users.",
        ]},
        { heading: "Changes and contact", body: [
          "We may update these terms; continued use after a change means you accept it.",
          `Questions? Email ${SITE.email}.`,
        ]},
      ]}
    />
  );
}