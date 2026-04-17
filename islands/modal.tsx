import { ComponentChild } from "preact"
import { Signal, useSignalEffect } from "@preact/signals"
import { useEffect } from "preact/hooks"

export interface ModalOptions {
    isActive?: boolean
    action?: "opened" | "closed"
}

interface ModalProps {
    children: ComponentChild
    options: Signal<ModalOptions>
}

export default function Modal(props: ModalProps) {
    const { options } = props

    const close = () => {
        if (options.value.isActive == true) {
            options.value = { isActive: false, action: "closed" }
        }
    }

    useSignalEffect(() => { // Mantém action em acordo com active
        if (options.value.isActive === true && options.value.action !== "opened") {
            options.value = { ...options.value, action: "opened" }
        }

        if (options.value.isActive === false && options.value.action !== "closed") {
            options.value = { ...options.value, action: "closed" }
        }

        if (options.value.isActive == undefined && options.value.action !== undefined) {
            options.value = { ...options.value, action: undefined }
        }
    })

    // useEffect(() => {
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if (event.key === "Escape" && options.value.isActive) {
    //             close()
    //         }
    //     }

    //     document.addEventListener("keydown", handleKeyDown)
    //     return () => document.removeEventListener("keydown", handleKeyDown)
    // }, [])

    return (
        <div class={` modal ${options.value.isActive ? "is-active" : ""}`}>
            <div class="modal-background is-clickable" onClick={() => close()}></div>
            <div class="modal-content">
                {props.children}
            </div>
        </div>
    )
}
