import SignupPage from "./signup/page";
import DashboardPage from "./dashboard/page";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <SignupPage />      
    </main>
  );
};