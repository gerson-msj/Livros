import type { ComponentChild } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

export type PopupMessageResult = "ok" | "cancel"
export type PopupMessageTheme = "primary" | "info" | "success" | "warning" | "danger"

export interface PopupMessageOptions {
    message: string
    title?: string
    theme?: PopupMessageTheme
    positiveText?: string
    negativeText?: string
    showPositiveButton?: boolean
    showNegativeButton?: boolean
}

export interface NormalizedPopupMessageOptions {
    message: string
    title?: string
    theme: PopupMessageTheme
    positiveText: string
    negativeText: string
    showPositiveButton: boolean
    showNegativeButton: boolean
}

interface ActiveMessage {
    options: NormalizedPopupMessageOptions
    finish(result: PopupMessageResult): void
}

export function usePopupMessage(): {
    popup: ComponentChild
    showMessage(options: PopupMessageOptions): Promise<PopupMessageResult>
} {
    const [activeMessage, setActiveMessage] = useState<ActiveMessage | null>(null)

    useEffect(() => {
        if (!activeMessage) {
            return
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                activeMessage.finish("cancel")
            }
        }

        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [activeMessage])

    return useMemo(() => ({
        popup: activeMessage && <PopupMessageDialog activeMessage={activeMessage} />,
        showMessage(options: PopupMessageOptions) {
            return new Promise<PopupMessageResult>((resolve) => {
                const session = createPopupMessageSession((result) => {
                    setActiveMessage(null)
                    resolve(result)
                })

                setActiveMessage({
                    options: normalizePopupMessageOptions(options),
                    finish: session.finish
                })
            })
        }
    }), [activeMessage])
}

export function normalizePopupMessageOptions(options: PopupMessageOptions): NormalizedPopupMessageOptions {
    return {
        message: options.message,
        title: options.title,
        theme: options.theme ?? "info",
        positiveText: options.positiveText ?? "OK",
        negativeText: options.negativeText ?? "Cancelar",
        showPositiveButton: options.showPositiveButton ?? true,
        showNegativeButton: options.showNegativeButton ?? false
    }
}

export function getPopupMessageThemeClass(theme: PopupMessageTheme): string {
    return `is-${theme}`
}

export function createPopupMessageSession(resolve: (result: PopupMessageResult) => void): {
    finish(result: PopupMessageResult): void
} {
    let finished = false

    return {
        finish(result) {
            if (finished) {
                return
            }

            finished = true
            resolve(result)
        }
    }
}

function PopupMessageDialog({ activeMessage }: { activeMessage: ActiveMessage }) {
    const { options } = activeMessage
    const themeClass = getPopupMessageThemeClass(options.theme)
    const themeAccentClass = `livros-popup-message-card-${options.theme}`

    return (
        <div
            class="modal is-active livros-popup-message"
            role="dialog"
            aria-modal="true"
            aria-labelledby={options.title ? "popup-message-title" : undefined}
        >
            <button
                class="modal-background"
                type="button"
                aria-label="Cancelar mensagem"
                onClick={() => activeMessage.finish("cancel")}
            >
            </button>
            <div class={`modal-card livros-popup-message-card ${themeAccentClass}`}>
                {options.title && (
                    <header class={`modal-card-head has-background-${options.theme}-light`}>
                        <p class={`modal-card-title has-text-${options.theme}`} id="popup-message-title">{options.title}</p>
                    </header>
                )}
                <section class="modal-card-body">
                    <div class="livros-popup-message-text">
                        {options.message.split(/\r?\n/).map((line, index) => (
                            <>
                                {index > 0 && <br />}
                                {line}
                            </>
                        ))}
                    </div>
                </section>
                {(options.showPositiveButton || options.showNegativeButton) && (
                    <footer class="modal-card-foot livros-popup-message-actions">
                        {options.showNegativeButton && (
                            <button
                                class="button livros-popup-message-button"
                                type="button"
                                onClick={() => activeMessage.finish("cancel")}
                            >
                                {options.negativeText}
                            </button>
                        )}
                        {options.showPositiveButton && (
                            <button
                                class={`button ${themeClass} livros-popup-message-button`}
                                type="button"
                                onClick={() => activeMessage.finish("ok")}
                            >
                                {options.positiveText}
                            </button>
                        )}
                    </footer>
                )}
            </div>
        </div>
    )
}
