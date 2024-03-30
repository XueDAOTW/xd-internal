import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentProps } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  FieldErrors,
  SubmitErrorHandler,
} from "react-hook-form";
import { type TypeOf, type ZodSchema } from "zod";

interface UseZodFormProps<T extends ZodSchema<any>>
  extends UseFormProps<TypeOf<T>> {
  schema: T;
}

export const useZodForm = <T extends ZodSchema<any>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) => {
  return useForm({
    mode: "all",
    ...formConfig,
    resolver: zodResolver(schema),
  });
};

interface Props<T extends FieldValues = any>
  extends Omit<ComponentProps<"form">, "onSubmit" | "onError"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onError?: SubmitErrorHandler<T>;
  disabled?: boolean;
  disableOnSubmit?: boolean;
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  onError,
  disabled,
  disableOnSubmit = true,
  children,
  ...props
}: Props<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} {...props}>
        <fieldset
          disabled={disableOnSubmit ? form.formState.isSubmitting : disabled}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

export const getMessageFromFieldErrors = (
  errors: FieldErrors,
  name: string,
): string => {
  return errors[name]?.message?.toString() ?? "";
};
