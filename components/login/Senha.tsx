import { useSignal } from "@preact/signals"
import { InputHTMLAttributes } from "preact"

export default function Senha({ ...inputHtmlAttributes }: InputHTMLAttributes<HTMLInputElement>) {
  const showPassword = useSignal(false)
  return (
    <div class="field">
      <label class="label">Senha</label>
      <div class="control has-icons-left has-icons-right">
        <input
          type={showPassword.value ? "text" : "password"}
          {...inputHtmlAttributes}
        />
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
