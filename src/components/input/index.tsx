import { type RegisterOptions, type UseFormRegister,  type FieldValues,  type Path } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  type: string;
  placeholder: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  rules?: RegisterOptions<T>;
}

export function Input<T extends FieldValues>({name, placeholder, type, register, rules, error}: InputProps<T>) {
    return(
        <div>
            <input
                className="w-full border-2 rounded-md h-11 px-2"
                placeholder={placeholder}
                type={type}
                {...register(name, rules)}
                id={name}
            />
            {error && <p className="my text-red-500">{error}</p>} 
        </div>
    )
}