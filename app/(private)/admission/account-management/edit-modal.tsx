"use client";

import { useCreateQueryString } from "@hooks/useCreateQueryString";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "utils/supabase";
import { LoadingComponent } from "@components/ui";
import { Tables } from "types/supabase-helpers";
import { useForm } from "react-hook-form";
import { SelectInput, TextInput } from "@components/inputs";
import { toast } from "sonner";
import { modalAction } from "@helper/modalAction";

type User = Omit<Tables<"user">, "password">;

type editInfo = {
  email: string;
  name: string;
  password: string;
  role: "student" | "admission" | "assessor";
};

function EditModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const createQueryString = useCreateQueryString();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { register, handleSubmit, setValue } = useForm<editInfo>();
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!id) return;

      try {
        const { data: user } = await supabase
          .from("user")
          .select("email, name, role, id, created_at")
          .eq("id", id)
          .single();

        setUser(user);
        setValue("name", user?.name!);
        setValue("email", user?.email!);
        setValue("role", user?.role!);
        setValue("password", "");
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id, setValue]);

  const onSubmit = async (values: editInfo) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: user?.id,
          updatePassword: isEditable,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        console.error(data.error);
        return;
      }

      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      modalAction("edit_modal", "close");
      setIsEditable(false);
      setUser(null);
      router.push("?" + createQueryString("id", ""));
    }
  };

  const handleExitModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditable(false);
    modalAction("edit_modal", "close");
    setUser(null);
    router.push("?" + createQueryString("id", ""));
  };

  return (
    <dialog id="edit_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit User</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!user ? (
            <div className="grid justify-center">
              <LoadingComponent size="md" />
            </div>
          ) : (
            <>
              <div className="my-3 grid grid-cols-2 gap-1">
                <TextInput
                  label="Name"
                  name="name"
                  placeholder="Name"
                  register={register}
                  defaultValue={user.name}
                />
                <TextInput
                  label="Email"
                  name="email"
                  placeholder="email"
                  register={register}
                  defaultValue={user.email}
                />
                <SelectInput
                  label="Role"
                  name="role"
                  options={["student", "admission", "assessor"]}
                  register={register}
                  defaultValue={user.role}
                />
                <TextInput
                  disabled={!isEditable}
                  label="New Password"
                  name="password"
                  placeholder="New Password"
                  register={register}
                  className="col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isEditable}
                  onChange={() => setIsEditable((prev) => !prev)}
                />{" "}
                <span className="text-neutral-500">Update password</span>
              </div>
            </>
          )}
          <div className="modal-action">
            <button
              disabled={isLoading}
              onClick={handleExitModal}
              className="btn btn-error text-white"
            >
              Close
            </button>
            <button disabled={isLoading} className="btn btn-success text-white">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
export default EditModal;
