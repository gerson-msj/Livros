import { useSignal } from "@preact/signals"
import { ILoginModel, validateLoginModel } from "../../app/domain/models/login-model.ts"
import Usuario from "../../components/login/Usuario.tsx"
import Senha from "../../components/login/Senha.tsx"
import Validations from "../../components/Validations.tsx"
import { ILoginData } from "../../routes/index.tsx"
import { useEffect } from "preact/hooks"

export default function Login(props: { model: ILoginModel }) {
  const model = useSignal(props.model)
  const errMsgs = useSignal<string[]>([])
  
  const onChange = <k extends keyof ILoginModel>(key: k, value: ILoginModel[k]) => {
    const changed = { ...model.value, [key]: value }
    const changedValidated = getModelValidated(changed, key)
    model.value = changedValidated
    updateErrMsgs()
  }
  const getModelValidated = (model: ILoginModel, key?: keyof ILoginModel): ILoginModel => {
    const newValidations = validateLoginModel(model, key)
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

  const classNames = (key: keyof ILoginModel) => {
    return model.value.validationResults.some((v) => v.key === key) ? "input is-danger" : "input"
  }

  const entrar = async () => {
    const isValid = validateAll()
    if (!isValid) {
      return
    }

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(model.value)
      })
      
      if (response.ok) {
        globalThis.location.href = "/biblioteca"
      } else {
        const data: ILoginData = await response.json()
        errMsgs.value = [data.errMsg ?? `Status: ${response.status}.`]
      }
    } catch (error) {
      const errMsg = "Falha de comunicação com o servidor"
      console.error(errMsg, error)
      errMsgs.value = [errMsg]
    }
  }

  useEffect(() => {
    globalThis.location.href = "/biblioteca"
  }, [])

  return (
    <>
      <Usuario
        value={model.value.usuario}
        onChange={({ currentTarget: { value } }) => onChange("usuario", value)}
        class={classNames("usuario")}
        placeholder="Informe seu nome de usuário"
      />

      <Senha
        value={model.value.senha}
        onChange={({ currentTarget: { value } }) => onChange("senha", value)}
        class={classNames("senha")}
        placeholder="Informe sua senha"
      />

      <div class="buttons">
        <button type="button" class="button is-primary" onClick={() => entrar()}>Entrar</button>
        <a href="/cadastro" class="button is-dark is-responsive">Cadastrar</a>
        <a href="/redefinir-senha" class="button is-dark is-responsive">Redefinir Senha</a>
      </div>

      <Validations validations={errMsgs.value} />
    </>
  )
}
