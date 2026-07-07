import { useMe } from "@/hooks/useMe.js";
import { Skeleton } from "@/components/common/Skeleton.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";
import { ProfileForm } from "./ProfileForm.jsx";
import { PasswordForm } from "./PasswordForm.jsx";

export default function Profile() {
  const { data, isLoading, isError, refetch, updateProfile, isUpdating } = useMe();

  if (isLoading) return <Skeleton className="h-64" />;
  if (isError) return <ErrorState onRetry={refetch} message="Impossible de charger le profil." />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <h1 className="text-2xl font-bold text-text">Profil</h1>
      <ProfileForm profile={data.profile} onSave={updateProfile} saving={isUpdating} />
      <PasswordForm />
    </div>
  );
}
