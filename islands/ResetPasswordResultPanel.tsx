import { useState } from "preact/hooks"
import { CopyableResetKeyField } from "./AuthFields.tsx"
import { copyResetKey } from "./ResetKeyPanel.tsx"

type CopyStatus = "idle" | "copied" | "unavailable" | "failed"

export default function ResetPasswordResultPanel({ resetKey }: { resetKey: string }) {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")

    async function copyKey() {
        setCopyStatus(await copyResetKey(resetKey))
    }

    return (
        <div class="box">
            <div class="notification is-success is-light">
                <p class="has-text-weight-semibold">Senha redefinida.</p>
                <p>Guarde a nova chave de redefinicao antes de continuar.</p>
            </div>

            <CopyableResetKeyField id="new-reset-key" label="Nova chave de redefinicao" resetKey={resetKey} onCopy={copyKey} />

            {copyStatus === "copied" && <p class="help is-success" role="status">Chave copiada.</p>}
            {copyStatus === "unavailable" && <p class="help" role="status">Copie a chave manualmente.</p>}
            {copyStatus === "failed" && <p class="help is-danger" role="status">Nao foi possivel copiar. Copie manualmente.</p>}

            <div class="field mt-4">
                <a class="button is-primary is-fullwidth" href="/biblioteca">
                    <span class="icon">
                        <i class="fas fa-book-open" aria-hidden="true"></i>
                    </span>
                    <span>Ir para biblioteca</span>
                </a>
            </div>
        </div>
    )
}
