export default function Login() {
  return (
    <div class="field">
      <label class="label">Chave de Recuperação</label>
      <div class="control has-icons-left">
        <input class="input" name="chave" type="text" placeholder="Digite sua chave de recuperação" />
        <span class="icon is-small is-left">
          <i class="fas fa-key"></i>
        </span>
      </div>
    </div>
  )
}
