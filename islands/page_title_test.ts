import { assert, assertEquals } from "jsr:@std/assert@1"
import { createPageTitleBackIntent, navigateToBackHref, PAGE_TITLE_BACK_INTENT_EVENT, submitLogoutForm } from "./PageTitle.tsx"

Deno.test("createPageTitleBackIntent informa apenas a intencao de voltar", () => {
    const event = createPageTitleBackIntent("Cadastro")

    assertEquals(event.type, PAGE_TITLE_BACK_INTENT_EVENT)
    assertEquals(event.detail, { title: "Cadastro" })
    assertEquals(event.bubbles, true)
})

Deno.test("navigateToBackHref altera o destino quando href foi informado", () => {
    const locationRef = {
        href: ""
    } as Location

    assertEquals(navigateToBackHref("/login", locationRef), true)
    assertEquals(locationRef.href, "/login")
    assertEquals(navigateToBackHref(undefined, locationRef), false)
})

Deno.test("submitLogoutForm aciona o formulario existente", () => {
    let submitted = false
    const form = {
        requestSubmit() {
            submitted = true
        }
    }
    const documentRef = {
        getElementById(id: string) {
            assertEquals(id, "logout-form")
            return form
        }
    } as unknown as Document
    const originalHtmlFormElement = globalThis.HTMLFormElement

    try {
        globalThis.HTMLFormElement = Object as unknown as typeof HTMLFormElement

        assertEquals(submitLogoutForm("logout-form", documentRef), true)
        assert(submitted)
    } finally {
        globalThis.HTMLFormElement = originalHtmlFormElement
    }
})

Deno.test("submitLogoutForm nao falha quando o formulario nao existe", () => {
    const documentRef = {
        getElementById() {
            return null
        }
    } as unknown as Document

    assertEquals(submitLogoutForm("logout-form", documentRef), false)
})
