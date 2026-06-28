import { useEffect, useState } from "preact/hooks"
import { PasswordField, togglePasswordVisibility } from "./AuthFields.tsx"

export interface CadastroFormProps {
    username: string
    password: string
    errors: CadastroFormErrors
}

export interface CadastroFormErrors {
    username?: string
    password?: string
    general?: string
}

type FieldName = "username" | "password"

export default function CadastroForm({ username, password, errors }: CadastroFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [visibleErrors, setVisibleErrors] = useState(errors)

    useEffect(() => {
        setVisibleErrors(errors)
    }, [errors])

    return (
        <form method="post" class="box">
            {visibleErrors.general && <div class="notification is-danger is-light">{visibleErrors.general}</div>}

            <div class="field">
                <label class="label" for="username">Nome de usuário</label>
                <div class="control has-icons-left">
                    <input
                        class={`input ${visibleErrors.username ? "is-danger" : ""}`}
                        id="username"
                        name="username"
                        type="text"
                        autocomplete="username"
                        defaultValue={username}
                        aria-invalid={visibleErrors.username ? "true" : "false"}
                        aria-describedby={visibleErrors.username ? "username-error" : undefined}
                        onInput={() => setVisibleErrors((current) => clearFieldError(current, "username"))}
                    />
                    <span class="icon is-small is-left">
                        <i class="fas fa-user" aria-hidden="true"></i>
                    </span>
                </div>
                {visibleErrors.username && <p class="help is-danger" id="username-error">{visibleErrors.username}</p>}
            </div>

            <PasswordField
                id="password"
                name="password"
                label="Senha"
                autocomplete="new-password"
                showPassword={showPassword}
                value={password}
                error={visibleErrors.password}
                onInput={() => setVisibleErrors((current) => clearFieldError(current, "password"))}
                onToggle={() => setShowPassword(togglePasswordVisibility)}
            />

            <div class="field">
                <button class="button is-primary is-fullwidth" type="submit">
                    <span class="icon">
                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                    </span>
                    <span>Criar conta</span>
                </button>
            </div>
        </form>
    )
}

export function clearFieldError(errors: CadastroFormErrors, field: FieldName): CadastroFormErrors {
    const nextErrors = { ...errors }
    delete nextErrors[field]
    return nextErrors
}
