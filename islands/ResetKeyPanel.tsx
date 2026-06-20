import { useState } from "preact/hooks"
import { CopyableResetKeyField } from "./AuthFields.tsx"

type CopyStatus = "idle" | "copied" | "unavailable" | "failed"

interface ClipboardLike {
    writeText(text: string): Promise<void>
}

export default function ResetKeyPanel({ resetKey }: { resetKey: string }) {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")

    async function copyKey() {
        setCopyStatus(await copyResetKey(resetKey))
    }

    return (
        <div class="box">
            <div class="notification is-success is-light">
                <p class="has-text-weight-semibold">Conta criada.</p>
                <p>Guarde sua chave de redefinicao de senha.</p>
            </div>

            <CopyableResetKeyField id="reset-key" label="Chave de redefinicao" resetKey={resetKey} onCopy={copyKey} />

            <div class="field">
                <a class="button is-primary is-fullwidth" href="/biblioteca">
                    <span class="icon">
                        <i class="fas fa-book-open" aria-hidden="true"></i>
                    </span>
                    <span>Ir para biblioteca</span>
                </a>
            </div>

            {copyStatus === "copied" && <p class="help is-success" role="status">Chave copiada.</p>}
            {copyStatus === "unavailable" && <p class="help" role="status">Copie a chave manualmente.</p>}
            {copyStatus === "failed" && <p class="help is-danger" role="status">Nao foi possivel copiar. Copie manualmente.</p>}
        </div>
    )
}

export async function copyResetKey(
    resetKey: string,
    clipboard: ClipboardLike | undefined = globalThis.navigator?.clipboard
): Promise<CopyStatus> {
    if (!clipboard) {
        return "unavailable"
    }

    try {
        await clipboard.writeText(resetKey)
        return "copied"
    } catch {
        return "failed"
    }
}
