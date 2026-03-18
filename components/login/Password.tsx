import { useSignal } from "@preact/signals"

export default function Password() {
  const showPassword = useSignal(false)
  return (
    <div class="field">
      <label class="label">Senha</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type={showPassword.value ? "text" : "password"} placeholder="Digite sua senha" />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
        <span class="icon is-small is-right is-clickable" onClick={() => showPassword.value = !showPassword.value}>
          <i class={showPassword.value ? "fas fa-eye-slash" : "fas fa-eye"}></i>
        </span>
      </div>
    </div>
  )
}
