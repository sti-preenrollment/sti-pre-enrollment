import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type CheckboxInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
};

function CheckboxInput<T extends FieldValues>({
  label,
  register,
  name,
}: CheckboxInputProps<T>) {
  return (
    <div className="form-control">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="checkbox-primary checkbox checkbox-sm"
          {...register(name)}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

export default CheckboxInput;
