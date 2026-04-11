import { useSignal } from "@preact/signals"
import Usuario from "../../components/login/Usuario.tsx"
import Senha from "../../components/login/Senha.tsx"
import Validations from "../../components/Validations.tsx"
import { IRedefinirSenhaModel, validateRedefinirSenhaModel } from "../../app/domain/models/redefinir-senha-model.ts"
import { IRedefinirSenhaData } from "../../routes/redefinir-senha.tsx"
import Chave from "../../components/login/Chave.tsx"

export default function RedefinirSenha(props: { model: IRedefinirSenhaModel }) {
    const model = useSignal(props.model)
    const errMsgs = useSignal<string[]>([])
    const chave = useSignal<string | undefined>(undefined)
    const possuiChave = chave.value !== undefined

    const onChange = <k extends keyof IRedefinirSenhaModel>(key: k, value: IRedefinirSenhaModel[k]) => {
        const changed = { ...model.value, [key]: value }
        const changedValidated = getModelValidated(changed, key)
        model.value = changedValidated
        updateErrMsgs()
    }

    const getModelValidated = (model: IRedefinirSenhaModel, key?: keyof IRedefinirSenhaModel): IRedefinirSenhaModel => {
        const newValidations = validateRedefinirSenhaModel(model, key)
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

    const classNames = (key: keyof IRedefinirSenhaModel) => {
        return model.value.validationResults.some((v) => v.key === key) ? "input is-danger" : "input"
    }

    const redefinir = async () => {
        const isValid = validateAll()
        if (!isValid) {
            return
        }

        try {
            const response = await fetch("/redefinir-senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(model.value)
            })

            const data: IRedefinirSenhaData = await response.json()
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

            <Chave
                value={model.value.chave}
                onChange={({ currentTarget: { value } }) => onChange("chave", value)}
                class={classNames("chave")}
                placeholder="Informe sua chave de redefinição de senha"
                disabled={possuiChave}
            />

            <Senha
                value={model.value.senha}
                onChange={({ currentTarget: { value } }) => onChange("senha", value)}
                class={classNames("senha")}
                placeholder="Informe sua nova senha"
                disabled={possuiChave}
            />

            {possuiChave && (
                <article class="message is-info">
                    <div class="message-header">
                        <p>Redefinição de senha realizada com sucesso!</p>
                    </div>
                    <div class="message-body">
                        <p>
                            Chave para redefinição de senha: <span class="has-text-weight-bold">{chave.value}</span>
                        </p>
                        <p>Anote esta chave para realizar novas redefinições no futuro.</p>
                    </div>
                </article>
            )}

            <div class="buttons">
                {!possuiChave && (
                    <>
                        <button type="button" class="button is-primary" onClick={() => redefinir()}>Redefinir</button>
                        <a href="/" class="button is-dark">Voltar</a>
                    </>
                )}
                {possuiChave && <a href="/" class="button is-primary">Entrar</a>}
            </div>

            <Validations errMsgs={errMsgs.value} />
        </>
    )
}
