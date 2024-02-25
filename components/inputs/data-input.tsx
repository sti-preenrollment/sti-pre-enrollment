import classNames from "classnames";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type DateInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  className?: string;
  register: UseFormRegister<T>;
  required?: boolean;
  error?: string;
};

function DateInput<T extends FieldValues>({
  name,
  label,
  register,
  className,
  required = false,
  error,
}: DateInputProps<T>) {
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
        type="date"
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

export default DateInput;
