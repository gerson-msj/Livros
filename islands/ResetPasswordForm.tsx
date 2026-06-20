import { useEffect, useState } from "preact/hooks"
import { PasswordField, togglePasswordVisibility } from "./AuthFields.tsx"

export interface ResetPasswordFormProps {
    username: string
    resetKey: string
    error?: string
}

export default function ResetPasswordForm({ username, resetKey, error }: ResetPasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [visibleError, setVisibleError] = useState(error)

    useEffect(() => {
        setVisibleError(error)
    }, [error])

    return (
        <form method="post" class="box">
            {visibleError && <div class="notification is-danger is-light">{visibleError}</div>}

            <div class="field">
                <label class="label" for="username">Nome de usuario</label>
                <div class="control has-icons-left">
                    <input
                        class="input"
                        id="username"
                        name="username"
                        type="text"
                        autocomplete="username"
                        defaultValue={username}
                        onInput={() => setVisibleError(undefined)}
                    />
                    <span class="icon is-small is-left">
                        <i class="fas fa-user" aria-hidden="true"></i>
                    </span>
                </div>
            </div>

            <div class="field">
                <label class="label" for="reset-key">Chave de redefinicao</label>
                <div class="control has-icons-left">
                    <input
                        class="input is-family-monospace"
                        id="reset-key"
                        name="resetKey"
                        type="text"
                        autocomplete="off"
                        defaultValue={resetKey}
                        onInput={() => setVisibleError(undefined)}
                    />
                    <span class="icon is-small is-left">
                        <i class="fas fa-key" aria-hidden="true"></i>
                    </span>
                </div>
            </div>

            <PasswordField
                id="new-password"
                name="newPassword"
                label="Nova senha"
                autocomplete="new-password"
                showPassword={showPassword}
                onInput={() => setVisibleError(undefined)}
                onToggle={() => setShowPassword(togglePasswordVisibility)}
            />

            <div class="field">
                <button class="button is-primary is-fullwidth" type="submit">
                    <span class="icon">
                        <i class="fas fa-rotate" aria-hidden="true"></i>
                    </span>
                    <span>Redefinir senha</span>
                </button>
            </div>
        </form>
    )
}
