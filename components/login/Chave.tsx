import { InputHTMLAttributes } from "preact"

export default function Chave({ ...inputHtmlAttributes }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div class="field">
            <label class="label">Chave</label>
            <div class="control has-icons-left">
                <input
                    {...inputHtmlAttributes}
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-key"></i>
                </span>
            </div>
        </div>
    )
}
