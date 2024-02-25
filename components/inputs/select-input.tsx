import classNames from "classnames";
import { ChangeEvent } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type SelectInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  options: string[];
  className?: string;
  register: UseFormRegister<T>;
  required?: boolean;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
};

function SelectInput<T extends FieldValues>({
  label,
  name,
  options,
  className,
  error,
  register,
  required = false,
  onChange,
  value,
  defaultValue,
  disabled,
}: SelectInputProps<T>) {
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
        className={classNames("select select-bordered", {
          "select-error focus:outline-accent": error,
          "focus:outline-primary": !error,
        })}
        {...register(name)}
        name={name}
        onChange={onChange}
        defaultValue={defaultValue || ""}
        value={value}
        disabled={disabled}
      >
        <option value="">Please select from the options</option>
        {options.map((item) => (
          <option value={item} key={item} className="capitalize">
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

export default SelectInput;
