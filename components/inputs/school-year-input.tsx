import classNames from "classnames";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

import { twMerge } from "tailwind-merge";

type SchoolYearSelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  className?: string;
  register: UseFormRegister<T>;
  required?: boolean;
  error?: string;
};

function SchoolYearSelect<T extends FieldValues>({
  label,
  name,
  register,
  className,
  required = false,
  error,
}: SchoolYearSelectProps<T>) {
  const options = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1999; i <= currentYear; i++) {
    options.push(`${i - 1}-${i}`);
  }

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
      <select
        className={classNames("select select-bordered  focus:outline-primary", {
          "select-error focus:outline-accent": error,
          "focus:outline-primary": !error,
        })}
        {...register(name)}
        defaultValue=""
      >
        <option disabled value="">
          Please select from the options
        </option>
        {options.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <label className="label">
        {error && <span className="label-text-alt text-red-500">{error}</span>}
      </label>
    </div>
  );
}

export default SchoolYearSelect;
