"use client";
import Image from "next/image";
interface DashboardHeaderProps {
  user: any;
  title?: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  title = `Welcome, ${user?.firstName || "there"}!`,
  subtitle = "Let's start your first 3D print.",
}) => {
  return (
    <div className="mb-8 px-8">
      <div className="flex flex-col items-center gap-2 mb-4">
        <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <p>{subtitle}</p>
    </div>
  );
};
