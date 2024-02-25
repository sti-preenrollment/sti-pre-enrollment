import { type FieldValues, type Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";

type InputType =
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "url";

type TextInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
  register: UseFormRegister<T>;
  type?: InputType;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  uneditable?: boolean;
};

function TextInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  error,
  register,
  type = "text",
  required = false,
  defaultValue,
  disabled = false,
  uneditable = false,
}: TextInputProps<T>) {
  return (
    <div className={twMerge(`form-control w-full ${className}`)}>
      <label className="label">
        <span className="label-text font-semibold">
          {label}
          <span
            className={classNames({
              "text-accent inline": required,
              hidden: !required,
            })}
          >
            {" "}
            *
          </span>
        </span>
      </label>
      <input
        disabled={disabled}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        className={classNames("input input-bordered w-full", {
          "input-error focus:outline-error": error,
          "focus:outline-primary": !error,
          "pointer-events-none bg-base-200": uneditable,
        })}
        {...register(name)}
      />
      <label className="label">
        {error && <span className="label-text-alt text-red-500">{error}</span>}
      </label>
    </div>
  );
}

export default TextInput;
