import { assertEquals } from "jsr:@std/assert@1"
import { clearFieldError } from "./CadastroForm.tsx"
import { copyResetKey } from "./ResetKeyPanel.tsx"

Deno.test("clearFieldError remove apenas o erro do campo editado", () => {
    const errors = {
        username: "Nome invalido.",
        password: "Senha invalida.",
        general: "Erro geral."
    }

    assertEquals(clearFieldError(errors, "username"), {
        password: "Senha invalida.",
        general: "Erro geral."
    })

    assertEquals(clearFieldError(errors, "password"), {
        username: "Nome invalido.",
        general: "Erro geral."
    })
})

Deno.test("copyResetKey envia a chave para a area de transferencia quando disponivel", async () => {
    let copiedText = ""

    const result = await copyResetKey("chave-uuid", {
        writeText(text: string) {
            copiedText = text
            return Promise.resolve()
        }
    })

    assertEquals(result, "copied")
    assertEquals(copiedText, "chave-uuid")
})

Deno.test("copyResetKey informa indisponibilidade ou falha sem ocultar copia manual", async () => {
    assertEquals(await copyResetKey("chave-uuid", undefined), "unavailable")

    const result = await copyResetKey("chave-uuid", {
        writeText() {
            return Promise.reject(new Error("clipboard blocked"))
        }
    })

    assertEquals(result, "failed")
})
