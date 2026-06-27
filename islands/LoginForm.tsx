import { useEffect, useState } from "preact/hooks"
import { PasswordField, togglePasswordVisibility } from "./AuthFields.tsx"

export interface LoginFormProps {
    username: string
    password: string
    error?: string
}

export default function LoginForm({ username, password, error }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [visibleError, setVisibleError] = useState(error)

    useEffect(() => {
        setVisibleError(error)
    }, [error])

    return (
        <form method="post" class="box">
            {visibleError && <div class="notification is-danger is-light">{visibleError}</div>}

            <div class="field">
                <label class="label" for="username">Nome de usuário</label>
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

            <PasswordField
                id="password"
                name="password"
                label="Senha"
                autocomplete="current-password"
                showPassword={showPassword}
                value={password}
                onInput={() => setVisibleError(undefined)}
                onToggle={() => setShowPassword(togglePasswordVisibility)}
            />

            <div class="field">
                <button class="button is-primary is-fullwidth" type="submit">
                    <span class="icon">
                        <i class="fas fa-right-to-bracket" aria-hidden="true"></i>
                    </span>
                    <span>Entrar</span>
                </button>
            </div>
        </form>
    )
}
