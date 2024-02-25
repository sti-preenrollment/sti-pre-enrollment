import classNames from "classnames";
import type { Control, FieldValues, Path } from "react-hook-form";
import PhoneInput from "react-phone-number-input/react-hook-form-input";
import { twMerge } from "tailwind-merge";

type ContactInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
  control: Control<T>;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
};

function ContactInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  error,
  control,
  required = false,
  defaultValue = "",
  disabled = false,
}: ContactInputProps<T>) {
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

      <div className="join">
        <span className="join-item btn btn-disabled">+63</span>
        <PhoneInput
          country="PH"
          defaultValue={defaultValue}
          international
          name={name}
          control={control}
          placeholder={placeholder}
          className={classNames("input join-item input-bordered w-full", {
            "input-error focus:outline-error": error,
            "focus:outline-primary": !error,
            "pointer-events-none bg-base-200": disabled,
          })}
        />
      </div>

      <label className="label">
        {error && <span className="label-text-alt text-red-500">{error}</span>}
      </label>
    </div>
  );
}

export default ContactInput;
