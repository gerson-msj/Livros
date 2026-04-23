import { Signal, useSignal } from "@preact/signals"
import { createDeferred, Deferred } from "@/app/domain/deferred.ts"
import { useEffect } from "preact/hooks"

type MsgboxResult = "ok" | "cancel"

interface MsgboxOptions {
    title?: string
    msg?: string
    ok?: string
    cancel?: string
}

interface MsgboxData {
    isActive: boolean
    options: MsgboxOptions
}

export class MsgboxController {
    public data?: Signal<MsgboxData>
    private deferred?: Deferred<MsgboxResult>

    public get isActive(): boolean {
        return this.data!.value.isActive === true
    }

    public open(options: MsgboxOptions): Promise<MsgboxResult> {
        if (this.isActive) {
            return Promise.reject("A msgbox já está aberta.")
        }

        this.data!.value = { ...this.data!.value, options, isActive: true }
        this.deferred = createDeferred<MsgboxResult>()
        return this.deferred.promise
    }

    public close(result: MsgboxResult) {
        if (this.isActive) {
            this.data!.value = { ...this.data!.value, isActive: false }
        }

        this.deferred?.resolve(result)
        this.deferred = undefined
    }
}

interface MsgboxProps {
    controller: MsgboxController
}

export function Msgbox(props: MsgboxProps) {
    const { controller } = props
    controller.data = useSignal<MsgboxData>({ isActive: false, options: {} })
    const { options } = controller.data.value

    useEffect(() => {
        return () => {
            controller.close("cancel")
        }
    }, [])

    return (
        <div class={` modal ${controller.isActive ? "is-active" : ""}`}>
            <div class="modal-background is-clickable" onClick={() => controller.close("cancel")}></div>
            <div class="modal-content">
                <div class="card">
                    {options.title !== undefined &&
                        (
                            <header class="card-header">
                                <p class="card-header-title">{options.title}</p>
                            </header>
                        )}
                    {options.msg !== undefined &&
                        (
                            <div class="card-content">
                                <div class="content">
                                    <p>{options.msg}</p>
                                </div>
                            </div>
                        )}
                    {(options.ok !== undefined || options.cancel !== undefined) &&
                        (
                            <footer class="card-footer">
                                {options.ok !== undefined &&
                                    (
                                        <button type="button" class="card-footer-item" onClick={() => controller.close("ok")}>
                                            {options.ok}
                                        </button>
                                    )}
                                {options.cancel !== undefined &&
                                    (
                                        <button type="button" class="card-footer-item" onClick={() => controller.close("cancel")}>
                                            {options.cancel}
                                        </button>
                                    )}
                            </footer>
                        )}
                </div>
            </div>
        </div>
    )
}
