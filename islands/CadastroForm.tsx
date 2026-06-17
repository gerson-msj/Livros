import { useState } from "preact/hooks"

export interface CadastroFormProps {
    username: string
    errors: {
        username?: string
        password?: string
        general?: string
    }
}

export default function CadastroForm({ username, errors }: CadastroFormProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <form method="post" class="box">
            {errors.general && <div class="notification is-danger is-light">{errors.general}</div>}

            <div class="field">
                <label class="label" for="username">Nome de usuario</label>
                <div class="control has-icons-left">
                    <input
                        class={`input ${errors.username ? "is-danger" : ""}`}
                        id="username"
                        name="username"
                        type="text"
                        autocomplete="username"
                        defaultValue={username}
                        aria-invalid={errors.username ? "true" : "false"}
                        aria-describedby={errors.username ? "username-error" : undefined}
                    />
                    <span class="icon is-small is-left">
                        <i class="fas fa-user" aria-hidden="true"></i>
                    </span>
                </div>
                {errors.username && <p class="help is-danger" id="username-error">{errors.username}</p>}
            </div>

            <div class="field">
                <label class="label" for="password">Senha</label>
                <div class="control has-icons-left">
                    <input
                        class={`input ${errors.password ? "is-danger" : ""}`}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autocomplete="new-password"
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <span class="icon is-small is-left">
                        <i class="fas fa-lock" aria-hidden="true"></i>
                    </span>
                </div>
                {errors.password && <p class="help is-danger" id="password-error">{errors.password}</p>}
            </div>

            <div class="field">
                <label class="checkbox">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(event) => setShowPassword(event.currentTarget.checked)}
                    />{" "}
                    Mostrar senha
                </label>
            </div>

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
