import LegalPage from "@/components/shared/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy Policy | RentNest" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="What we collect, why we collect it, and the choices you have."
      updated="October 25, 2026"
      sections={[
        { heading: "Information we collect", body: [
          "Account data: your name, email address, role (tenant or landlord) and a hashed password.",
          "Activity data: properties you save, rental requests you send, reviews you write, and listings you create if you are a landlord.",
          "Payment data: transaction IDs, amounts and status. Card details are entered on Stripe and are never stored by RentNest.",
        ]},
        { heading: "How we use it", body: [
          "To run the service: authenticate you, show you listings, route rental requests between tenants and landlords, and process payments.",
          "To keep the platform safe: detecting abuse and enforcing our Terms of Service.",
        ]},
        { heading: "Who we share it with", body: [
          "Landlords see the name, email and message of tenants who request their properties. Tenants see the name and email of the landlord of a listing.",
          "Service providers: Stripe processes payments, and Cloudinary hosts listing images. They only receive what they need to perform that function.",
          "We do not sell personal data.",
        ]},
        { id: "cookies", heading: "Cookies", body: [
          "We use two essential, httpOnly cookies, an access token and a refresh token, to keep you signed in. We also store your light or dark theme preference in your browser. We do not use advertising cookies.",
        ]},
        { heading: "Your choices", body: [
          `You can request access to, correction of, or deletion of your data by emailing ${SITE.email}.`,
          "Logging out clears your session cookies.",
        ]},
        { heading: "Contact", body: [`Questions about this policy? Email ${SITE.email}.`] },
      ]}
    />
  );
}