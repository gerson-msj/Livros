import type { JSX } from "preact"

export interface PasswordFieldProps {
    id: string
    name: string
    label: string
    autocomplete: string
    showPassword: boolean
    error?: string
    onInput?: JSX.GenericEventHandler<HTMLInputElement>
    onToggle: () => void
}

export interface CopyableResetKeyFieldProps {
    id: string
    label: string
    resetKey: string
    onCopy: () => void
}

export function PasswordField({ id, name, label, autocomplete, showPassword, error, onInput, onToggle }: PasswordFieldProps) {
    return (
        <div class="field">
            <label class="label" for={id}>{label}</label>
            <div class="control has-icons-left has-icons-right">
                <input
                    class={`input ${error ? "is-danger" : ""}`}
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    autocomplete={autocomplete}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : undefined}
                    onInput={onInput}
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-lock" aria-hidden="true"></i>
                </span>
                <button
                    class="livros-field-icon-button icon is-small is-right"
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword ? "true" : "false"}
                    onClick={onToggle}
                >
                    <i class={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true"></i>
                </button>
            </div>
            {error && <p class="help is-danger" id={`${id}-error`}>{error}</p>}
        </div>
    )
}

export function CopyableResetKeyField({ id, label, resetKey, onCopy }: CopyableResetKeyFieldProps) {
    return (
        <div class="field">
            <label class="label" for={id}>{label}</label>
            <div class="control has-icons-left has-icons-right">
                <input class="input is-family-monospace" id={id} type="text" value={resetKey} readonly />
                <span class="icon is-small is-left">
                    <i class="fas fa-key" aria-hidden="true"></i>
                </span>
                <button class="livros-field-icon-button icon is-small is-right" type="button" aria-label="Copiar chave" onClick={onCopy}>
                    <i class="fas fa-copy" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
}

export function togglePasswordVisibility(current: boolean): boolean {
    return !current
}
