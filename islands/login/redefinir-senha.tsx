import { useSignal } from "@preact/signals"
import Usuario from "../../components/login/Usuario.tsx"
import Senha from "../../components/login/Senha.tsx"
import Validations from "../../components/Validations.tsx"
import { IRedefinirSenhaModel, redefinirSenhaModelValidator } from "../../app/domain/models/redefinir-senha-model.ts"
import Chave from "../../components/login/Chave.tsx"
import ValidatorService from "@/app/services/validator-service.ts"
import PageService from "@/app/services/page-service.ts"
import { IRedefinirSenhaData } from "@/app/domain/data/redefinir-senha-data.ts"

export default function RedefinirSenha(props: { model: IRedefinirSenhaModel }) {
    const model = useSignal(props.model)
    const errMsgs = useSignal<string[]>([])
    const chave = useSignal<string | undefined>(undefined)
    const possuiChave = chave.value !== undefined
    const validator = new ValidatorService<IRedefinirSenhaModel>(redefinirSenhaModelValidator, model.value)

    const onChange = <k extends keyof IRedefinirSenhaModel>(key: k, value: IRedefinirSenhaModel[k]) => {
        const changed = { ...model.value, [key]: value }
        const changedValidated = validator.validateChanged(changed, key)
        model.value = changedValidated
        updateErrMsgs()
    }

    const updateErrMsgs = () => {
        errMsgs.value = model.value.validationResults?.map((v) => v.message) ?? []
    }

    const redefinir = async () => {
        model.value = validator.validateModel()
        updateErrMsgs()
        if (model.value.validationResults !== undefined) return

        await PageService.requestPost<IRedefinirSenhaModel, IRedefinirSenhaData>(
            model.value,
            (data) => chave.value = data.chave,
            (errors) => errMsgs.value = errors
        )
    }

    return (
        <>
            <p class="title is-3">Livros - Redefinir Senha</p>

            <Usuario
                value={model.value.usuario}
                onChange={({ currentTarget: { value } }) => onChange("usuario", value)}
                class={`input ${validator.class("usuario")}`}
                placeholder="Informe seu nome de usuário"
                disabled={possuiChave}
            />

            <Chave
                value={model.value.chave}
                onChange={({ currentTarget: { value } }) => onChange("chave", value)}
                class={`input ${validator.class("chave")}`}
                placeholder="Informe sua chave de redefinição de senha"
                disabled={possuiChave}
            />

            <Senha
                value={model.value.senha}
                onChange={({ currentTarget: { value } }) => onChange("senha", value)}
                class={`input ${validator.class("senha")}`}
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
