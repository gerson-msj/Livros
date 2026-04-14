import { useSignal } from "@preact/signals"
import { ILoginModel, loginModelValidator } from "../../app/domain/models/login-model.ts"
import Usuario from "../../components/login/Usuario.tsx"
import Senha from "../../components/login/Senha.tsx"
import Validations from "../../components/Validations.tsx"
import ValidatorService from "../../app/services/validator-service.ts"
import ControllerService from "../../app/services/controller-service.ts"

export default function Login(props: { model: ILoginModel }) {
    const model = useSignal(props.model)
    const errMsgs = useSignal<string[]>([])
    const validator = new ValidatorService<ILoginModel>(loginModelValidator)

    const onChange = <k extends keyof ILoginModel>(key: k, value: ILoginModel[k]) => {
        const changed = { ...model.value, [key]: value }
        const changedValidated = validator.validateModel(changed, key)
        model.value = changedValidated
        updateErrMsgs()
    }

    const updateErrMsgs = () => {
        errMsgs.value = model.value.validationResults?.map((v) => v.message) ?? []
    }

    const entrar = async () => {
        model.value = validator.validateModel(model.value)
        updateErrMsgs()
        if (model.value.validationResults !== undefined) return

        await ControllerService.requestServer(
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(model.value)
            },
            () => globalThis.location.href = "/biblioteca",
            (errors) => errMsgs.value = errors
        )
    }

    return (
        <>
            <h1 class="title">Livros - Login</h1>

            <Usuario
                value={model.value.usuario}
                onChange={({ currentTarget: { value } }) => onChange("usuario", value)}
                class={`input ${validator.getValidationClass(model.value, "usuario")}`}
                placeholder="Informe seu nome de usuário"
            />

            <Senha
                value={model.value.senha}
                onChange={({ currentTarget: { value } }) => onChange("senha", value)}
                class={`input ${validator.getValidationClass(model.value, "senha")}`}
                placeholder="Informe sua senha"
            />

            <div class="buttons">
                <button type="button" class="button is-primary" onClick={() => entrar()}>Entrar</button>
                <a href="/cadastro" class="button is-dark is-responsive">Cadastrar</a>
                <a href="/redefinir-senha" class="button is-dark is-responsive">Redefinir Senha</a>
            </div>

            <Validations errMsgs={errMsgs.value} />
        </>
    )
}
