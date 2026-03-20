import { InputHTMLAttributes } from "preact"

export default function Usuario({ ...inputHtmlAttributes }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div class="field">
      <label class="label">Login</label>
      <div class="control has-icons-left">
        <input
          {...inputHtmlAttributes}
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>
  )
}
