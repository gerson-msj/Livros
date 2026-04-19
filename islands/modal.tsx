import { ComponentChild } from "preact"
import { Signal, useSignal } from "@preact/signals"
import { createDeferred, Deferred } from "@/app/domain/deferred.ts"
import { useEffect } from "preact/hooks"

export interface ModalData {
    isActive?: boolean
}

export class ModalController {
    public data?: Signal<ModalData>
    private deferred?: Deferred<void>

    public get isActive(): boolean {
        return this.data!.value.isActive === true
    }

    public open(): Promise<void> {
        if (this.isActive) {
            return Promise.reject("A modal já está aberta.")
        }

        this.deferred = createDeferred()
        this.data!.value = { isActive: true }
        return this.deferred.promise
    }

    public close() {
        if (this.isActive) {
            this.data!.value = { isActive: false }
        }

        this.deferred?.resolve()
        this.deferred = undefined
    }
}

interface ModalProps {
    children: ComponentChild
    controller: ModalController
}

export default function Modal(props: ModalProps) {
    const { controller } = props
    controller.data = useSignal({})

    useEffect(() => {
        return () => {
            controller.close()
        }
    }, [])

    return (
        <div class={` modal ${controller.isActive ? "is-active" : ""}`}>
            <div class="modal-background is-clickable" onClick={() => controller.close()}></div>
            <div class="modal-content">
                {props.children}
            </div>
        </div>
    )
}
