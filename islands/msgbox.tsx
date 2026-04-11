import { Signal, useSignal, useSignalEffect } from "@preact/signals"
import Modal, { ModalOptions } from "./modal.tsx"

export interface MsgboxOptions {
    isActive?: boolean
    result?: "ok" | "cancel"
    title?: string
    msg?: string
    ok?: string
    cancel?: string
    key?: string
}

interface MsgboxProps {
    options: Signal<MsgboxOptions>
}

export default function Msgbox(props: MsgboxProps) {
    const { options } = props
    const modalOptions = useSignal<ModalOptions>({})

    useSignalEffect(() => { // By Modal
        const msgIsActive = options.peek().isActive ?? false
        const modalIsActive = modalOptions.value.isActive ?? false

        if (!modalIsActive && msgIsActive) {
            options.value = { ...options.peek(), isActive: false, result: "cancel" }
        }
    })

    /**
     * value assina o signal effect para leitura de alterações do signal
     * peek() não assina
     */
    useSignalEffect(() => { // By Msg
        const msgIsActive = options.value.isActive ?? false
        const modalIsActive = modalOptions.peek().isActive ?? false

        if (msgIsActive !== modalIsActive) {
            modalOptions.value = { ...modalOptions.peek(), isActive: msgIsActive }
        }
    })

    const onOk = () => {
        options.value = { ...options.value, isActive: false, result: "ok" }
    }

    const onCancel = () => {
        options.value = { ...options.value, isActive: false, result: "cancel" }
    }

    return (
        <Modal options={modalOptions}>
            <div class="card">
                {options.value.title !== undefined &&
                    (
                        <header class="card-header">
                            <p class="card-header-title">{options.value.title}</p>
                        </header>
                    )}
                {options.value.msg !== undefined &&
                    (
                        <div class="card-content">
                            <div class="content">
                                <p>{options.value.msg}</p>
                            </div>
                        </div>
                    )}
                {(options.value.ok !== undefined || options.value.cancel !== undefined) &&
                    (
                        <footer class="card-footer">
                            {options.value.ok !== undefined &&
                                <a href="#" class="card-footer-item" onClick={() => onOk()}>{options.value.ok}</a>}
                            {options.value.cancel !== undefined &&
                                <a href="#" class="card-footer-item" onClick={() => onCancel()}>{options.value.cancel}</a>}
                        </footer>
                    )}
            </div>
        </Modal>
    )
}
