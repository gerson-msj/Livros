import { ComponentChild } from "preact"
import { Signal, useSignalEffect } from "@preact/signals"

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
        options.value = { isActive: false, action: "closed" }
    }

    useSignalEffect(() => {
        if (options.value.isActive === true && options.value.action !== "opened") {
            options.value = { ...options.value, action: "opened" }
        }
    })

    return (
        <div class={` modal ${options.value.isActive ? "is-active" : ""}`}>
            <div class="modal-background is-clickable" onClick={() => close()}></div>
            <div class="modal-content">
                {props.children}
            </div>
        </div>
    )
}
