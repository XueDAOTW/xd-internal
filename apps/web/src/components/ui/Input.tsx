import { forwardRef, type ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, type = "text", autoComplete = "off", ...props },
  ref,
) {
  if (type === "checkbox") {
    return (
      <div>
        <label className="label cursor-pointer">
          {label && <span className="label-text">{label}</span>}
          <input
            type="checkbox"
            ref={ref}
            className="checkbox-primary checkbox"
            {...props}
          />
        </label>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div>
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          type="text"
          ref={ref}
          className={props.className || "input-bordered input w-full"}
          autoComplete={autoComplete}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }

  if (type === "file") {
    return (
      <div>
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          type="file"
          ref={ref}
          className={
            props.className ||
            "file-input-bordered file-input-primary file-input w-full"
          }
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }

  return <input type={type} {...props}></input>;
});
