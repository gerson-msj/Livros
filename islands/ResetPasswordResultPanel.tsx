import { useState } from "preact/hooks"
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

            <div class="field">
                <label class="label" for="new-reset-key">Nova chave de redefinicao</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input is-family-monospace" id="new-reset-key" type="text" value={resetKey} readonly />
                    <span class="icon is-small is-left">
                        <i class="fas fa-key" aria-hidden="true"></i>
                    </span>
                    <button
                        class="livros-field-icon-button icon is-small is-right"
                        type="button"
                        aria-label="Copiar chave"
                        onClick={copyKey}
                    >
                        <i class="fas fa-copy" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

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
