"use client";

import { modalAction } from "@helper/modalAction";
import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter } from "next/navigation";

function DialogModalButton({ id }: { id: string }) {
  const createQueryString = useCreateQueryString();
  const router = useRouter();

  const handleClick = () => {
    router.push("?" + createQueryString("id", id));
    modalAction("modal_1", "open");
  };

  return (
    <button
      className="btn btn-sm bg-primary text-xs text-white hover:border-primary hover:bg-white hover:text-primary"
      onClick={handleClick}
    >
      View
    </button>
  );
}
export default DialogModalButton;
