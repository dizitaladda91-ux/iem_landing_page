import AdminPortal from "@/components/AdminPortal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal & Voting Leads | Jashn Realty Presents Runway Kids Fashion Week",
  description: "Official portal for contestant card submissions, Cloudinary uploads, and voter leads management.",
};

export default function PortalSubmitPage() {
  return <AdminPortal />;
}
