import { type FieldValues, type Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import classNames from "classnames";

type TimeInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  className?: string;
  error?: string;
  register: UseFormRegister<T>;
  required?: boolean;
};

function TimeInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  error,
  register,
  required = false,
}: TimeInputProps<T>) {
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
        type="time"
        placeholder={placeholder}
        className={classNames("input input-bordered w-full", {
          "input-error focus:outline-error": error,
          "focus:outline-primary": !error,
        })}
        {...register(name)}
      />
      <label className="label">
        {error && <span className="label-text-alt text-red-500">{error}</span>}
      </label>
    </div>
  );
}

export default TimeInput;
