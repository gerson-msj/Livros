import { assertEquals } from "jsr:@std/assert@1"
import {
    createPopupMessageSession,
    getPopupMessageThemeClass,
    normalizePopupMessageOptions,
    type PopupMessageResult
} from "./PopupMessage.tsx"

Deno.test("normalizePopupMessageOptions aplica valores padrao e permite esconder todos os botoes", () => {
    assertEquals(normalizePopupMessageOptions({ message: "Linha 1\nLinha 2" }), {
        message: "Linha 1\nLinha 2",
        title: undefined,
        theme: "info",
        positiveText: "OK",
        negativeText: "Cancelar",
        showPositiveButton: true,
        showNegativeButton: false
    })

    assertEquals(
        normalizePopupMessageOptions({
            message: "Aguarde",
            theme: "warning",
            positiveText: "Continuar",
            negativeText: "Voltar",
            showPositiveButton: false,
            showNegativeButton: false
        }),
        {
            message: "Aguarde",
            title: undefined,
            theme: "warning",
            positiveText: "Continuar",
            negativeText: "Voltar",
            showPositiveButton: false,
            showNegativeButton: false
        }
    )
})

Deno.test("getPopupMessageThemeClass mapeia temas para classes Bulma", () => {
    assertEquals(getPopupMessageThemeClass("primary"), "is-primary")
    assertEquals(getPopupMessageThemeClass("info"), "is-info")
    assertEquals(getPopupMessageThemeClass("success"), "is-success")
    assertEquals(getPopupMessageThemeClass("warning"), "is-warning")
    assertEquals(getPopupMessageThemeClass("danger"), "is-danger")
})

Deno.test("createPopupMessageSession resolve apenas a primeira escolha", () => {
    const results: PopupMessageResult[] = []
    const session = createPopupMessageSession((result) => results.push(result))

    session.finish("cancel")
    session.finish("ok")

    assertEquals(results, ["cancel"])
})
