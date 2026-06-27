import type { JSX } from "preact"
import { useRef } from "preact/hooks"

type BookDateInputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
    label: string
}

export default function BookDateInput({ label, class: className, ...inputAttributes }: BookDateInputProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div class="field">
            {label && <label class="label livros-book-form-label">{label}</label>}
            <div class="control has-icons-right">
                <input
                    {...inputAttributes}
                    ref={inputRef}
                    type="date"
                    class={`input livros-book-date-input ${className ?? ""}`}
                />
                <button
                    class="icon is-small is-right livros-field-icon-button livros-book-date-picker-button"
                    type="button"
                    aria-label={`Abrir calendário de ${label}`}
                    onClick={() => inputRef.current?.showPicker()}
                >
                    <i class="fas fa-calendar" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
}
