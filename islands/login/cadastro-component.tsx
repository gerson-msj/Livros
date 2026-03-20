import { useSignal } from "@preact/signals"
import { ICadastroModel, validateCadastroModel } from "../../app/domain/models/cadastro-model.ts"
import Usuario from "../../components/login/Usuario.tsx"
import Senha from "../../components/login/Senha.tsx"
import Validations from "../../components/Validations.tsx"
import { ICadastroData } from "../../routes/cadastro.tsx"

export default function Cadastro(props: { model: ICadastroModel }) {
  const model = useSignal(props.model)
  const errMsgs = useSignal<string[]>([])
  const chave = useSignal<string | undefined>(undefined)
  const possuiChave = chave.value !== undefined

  const onChange = <k extends keyof ICadastroModel>(key: k, value: ICadastroModel[k]) => {
    const changed = { ...model.value, [key]: value }
    const changedValidated = getModelValidated(changed, key)
    model.value = changedValidated
    updateErrMsgs()
  }

  const getModelValidated = (model: ICadastroModel, key?: keyof ICadastroModel): ICadastroModel => {
    const newValidations = validateCadastroModel(model, key)
    const validationResults = [...model.validationResults.filter((r) => r.key !== key), ...newValidations]
    return { ...model, validationResults }
  }

  const validateAll = (): boolean => {
    const modelValidated = getModelValidated(model.value)
    model.value = modelValidated
    updateErrMsgs()
    return model.value.validationResults.length === 0
  }

  const updateErrMsgs = () => {
    errMsgs.value = model.value.validationResults.map((v) => v.message)
  }

  const classNames = (key: keyof ICadastroModel) => {
    return model.value.validationResults.some((v) => v.key === key) ? "input is-danger" : "input"
  }

  const cadastrar = async () => {
    const isValid = validateAll()
    if (!isValid) {
      return
    }

    try {
      const response = await fetch("/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(model.value)
      })

      const data: ICadastroData = await response.json()
      if (response.ok) {
        chave.value = data.chave
      } else {
        errMsgs.value = [data.errMsg ?? `Status: ${response.status}.`]
      }
    } catch (error) {
      const errMsg = "Falha de comunicação com o servidor"
      console.error(errMsg, error)
      errMsgs.value = [errMsg]
    }
  }

  return (
    <>
      <Usuario
        value={model.value.usuario}
        onChange={({ currentTarget: { value } }) => onChange("usuario", value)}
        class={classNames("usuario")}
        placeholder="Informe seu nome de usuário"
        disabled={possuiChave}
      />

      <Senha
        value={model.value.senha}
        onChange={({ currentTarget: { value } }) => onChange("senha", value)}
        class={classNames("senha")}
        placeholder="Informe sua senha"
        disabled={possuiChave}
      />

      {possuiChave && (
        <article class="message is-info">
          <div class="message-header">
            <p>Cadastro realizado com sucesso!</p>
          </div>
          <div class="message-body">
            <p>
              Chave de cadastro: <span class="has-text-weight-bold">{chave.value}</span>
            </p>
            <p>Anote sua chave de cadastro, ela será solicitada para recuperação de senha.</p>
          </div>
        </article>
      )}

      <div class="buttons">
        {!possuiChave && (
          <>
            <button type="button" class="button is-primary" onClick={() => cadastrar()}>Cadastrar</button>
            <a href="/" class="button is-dark">Voltar</a>
          </>
        )}
        {possuiChave && <a href="/" class="button is-primary">Entrar</a>}
      </div>

      <Validations validations={errMsgs.value} />
    </>
  )
}
