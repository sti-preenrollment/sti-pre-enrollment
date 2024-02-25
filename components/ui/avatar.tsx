import { User } from "@assets/icons";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

type AvatarProps = {
  className?: string;
  photoUrl?: string;
};

function Avatar({ className, photoUrl }: AvatarProps) {
  return (
    <div className="avatar placeholder">
      <div
        className={twMerge(
          `w-24 rounded-full bg-primary text-secondary ${className}`
        )}
      >
        {photoUrl ? (
          <Image className="object-cover" src={photoUrl} alt="avatar" />
        ) : (
          <span className="p-3">
            <User className="w-full" />
          </span>
        )}
      </div>
    </div>
  );
}

export default Avatar;
