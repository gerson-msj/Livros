import { useState } from "preact/hooks"

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

            <div class="field">
                <label class="label" for="reset-key">Chave de redefinicao</label>
                <div class="control has-icons-left">
                    <input class="input is-family-monospace" id="reset-key" type="text" value={resetKey} readonly />
                    <span class="icon is-small is-left">
                        <i class="fas fa-key" aria-hidden="true"></i>
                    </span>
                </div>
            </div>

            <div class="field">
                <button class="button is-info is-light is-fullwidth" type="button" onClick={copyKey}>
                    <span class="icon">
                        <i class="fas fa-copy" aria-hidden="true"></i>
                    </span>
                    <span>Copiar chave</span>
                </button>
            </div>

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
