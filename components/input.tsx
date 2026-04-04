import { InputHTMLAttributes } from "preact"

type InputTextType = InputHTMLAttributes<HTMLInputElement> & { label: string }

export default function Input({ label, ...inputHtmlAttributes }: InputTextType) {
    return (
        <div class="field">
            <label class="label">{label}</label>
            <div class="control">
                <input
                    {...inputHtmlAttributes}
                />
            </div>
        </div>
    )
}
