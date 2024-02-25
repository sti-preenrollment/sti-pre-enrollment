import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

function ResendButton({ isSubmitting }: { isSubmitting: boolean }) {
  const params = useParams();
  const [isClicked, setIsClicked] = useState(() => {
    // Get the button state from localStorage
    const storedState =
      typeof window !== "undefined" ? localStorage.getItem("isClicked") : null;
    return storedState ? JSON.parse(storedState) : false;
  });
  const [countdown, setCountdown] = useState(() => {
    // Get the countdown value from localStorage
    const storedCountdown =
      typeof window !== "undefined" ? localStorage.getItem("countdown") : null;
    return storedCountdown ? JSON.parse(storedCountdown) : 120;
  });

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (isClicked && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown: number) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsClicked(false);
      setCountdown(120);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isClicked, countdown]);

  useEffect(() => {
    // Store the countdown value and button state in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("countdown", JSON.stringify(countdown));
      localStorage.setItem("isClicked", JSON.stringify(isClicked));
    }
  }, [countdown, isClicked]);

  const handleResendOTP = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsClicked(true);

    const userId = params.userId as string;

    try {
      const response = await fetch("/api/user/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("New otp has been sent. Check your email.");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <button
      onClick={handleResendOTP}
      disabled={isClicked || isSubmitting}
      className="btn w-32 border-2 border-primary bg-transparent text-primary hover:border-primary hover:bg-transparent"
    >
      {isClicked
        ? `${Math.floor(countdown / 60)}:${(countdown % 60)
            .toString()
            .padStart(2, "0")}`
        : "Resend OTP"}
    </button>
  );
}

export default ResendButton;
