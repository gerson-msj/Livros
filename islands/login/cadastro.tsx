import { useSignal } from "@preact/signals"
import { cadastroModelValidator, ICadastroModel } from "../../app/domain/models/cadastro-model.ts"
import Usuario from "../../components/login/Usuario.tsx"
import Senha from "../../components/login/Senha.tsx"
import Validations from "../../components/Validations.tsx"
import ValidatorService from "../../app/services/validator-service.ts"
import ControllerService from "../../app/services/controller-service.ts"
import { ICadastroData } from "../../app/domain/data/cadastro-data.ts"

export default function Cadastro(props: { model: ICadastroModel }) {
    const model = useSignal(props.model)
    const errMsgs = useSignal<string[]>([])
    const validator = new ValidatorService<ICadastroModel>(cadastroModelValidator)
    const chave = useSignal<string | undefined>(undefined)
    const possuiChave = chave.value !== undefined

    const onChange = <k extends keyof ICadastroModel>(key: k, value: ICadastroModel[k]) => {
        const changed = { ...model.value, [key]: value }
        const changedValidated = validator.validateModel(changed, key)
        model.value = changedValidated
        updateErrMsgs()
    }

    const updateErrMsgs = () => {
        errMsgs.value = model.value.validationResults?.map((v) => v.message) ?? []
    }

    const cadastrar = async () => {
        console.log("cadastrar")
        model.value = validator.validateModel(model.value)
        updateErrMsgs()
        if (model.value.validationResults !== undefined) {
            return
        }

        const request: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model.value)
        }

        await ControllerService.requestServer<ICadastroData>(
            request,
            (data) => chave.value = data.chave,
            (errors) => errMsgs.value = errors
        )
    }

    return (
        <>
            <p class="title is-3">Livros - Cadastro</p>

            <Usuario
                value={model.value.usuario}
                onChange={({ currentTarget: { value } }) => onChange("usuario", value)}
                class={`input ${validator.getValidationClass(model.value, "usuario")}`}
                placeholder="Informe seu nome de usuário"
                disabled={possuiChave}
            />

            <Senha
                value={model.value.senha}
                onChange={({ currentTarget: { value } }) => onChange("senha", value)}
                class={`input ${validator.getValidationClass(model.value, "senha")}`}
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
                            Chave para redefinição de senha: <span class="has-text-weight-bold">{chave.value}</span>
                        </p>
                        <p>Anote esta chave para realizar uma redefinição de senha no futuro.</p>
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

            <Validations errMsgs={errMsgs.value} />
        </>
    )
}
