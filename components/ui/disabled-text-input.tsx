import { twMerge } from "tailwind-merge";

type DisabledTextInputProps = {
  label: string;
  value: string;
  className?: string;
};

function DisabledTextInput({
  label,
  value,
  className,
}: DisabledTextInputProps) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <input
        defaultValue={value}
        type="text"
        className={twMerge(
          "input pointer-events-none bg-slate-100 input-bordered input-sm w-full " +
            className
        )}
      />
    </div>
  );
}
export default DisabledTextInput;
