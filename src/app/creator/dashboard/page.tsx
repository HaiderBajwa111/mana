import { checkOnboardingStatus } from "@/app/actions/auth/check-onboarding-status";
import { fetchDashboardData } from "@/app/actions/dashboard/fetch-dashboard-data";
import { BuyerDashboardView } from "@/components/dashboard/creator/buyer-dashboard-view";
import Sidebar from "@/components/dashboard/sidebar";

export default async function CreatorDashboardPage() {
  const user = await checkOnboardingStatus();

  let dashboardData = null;
  try {
    dashboardData = await fetchDashboardData(user.id);
    console.log("🔍 Dashboard data received:", dashboardData);
    console.log("🔍 Total prints:", dashboardData?.stats?.totalPrints);
    console.log("🔍 Has projects:", dashboardData?.stats?.totalPrints > 0);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }

  return (
    <>
      <Sidebar userType="creator" user={user} />
      <main className="min-h-screen  pb-6 px-4 md:px-6 space-y-6">
        <BuyerDashboardView user={user} initialData={dashboardData} />
      </main>
    </>
  );
}
