import { ProfileForm } from "@/components/numerology/ProfileForm";
import type { NumerologyProfile } from "@/lib/profileStore";

interface ProfileFormModalProps {
  onSubmit: (profile: { name: string; day: number; month: number; year: number }) => void;
}

const FULL_PROFILE_KEY = "aionis_full_profile";

export default function ProfileFormModal({ onSubmit }: ProfileFormModalProps) {
  const handleSubmit = (np: NumerologyProfile) => {
    // Save the full profile with maiden/married/preferred names
    localStorage.setItem(FULL_PROFILE_KEY, JSON.stringify(np));
    // Pass simplified profile to app
    onSubmit({
      name: np.fullName,
      day: np.birthDay,
      month: np.birthMonth,
      year: np.birthYear,
    });
  };

  return <ProfileForm onSubmit={handleSubmit} />;
}
