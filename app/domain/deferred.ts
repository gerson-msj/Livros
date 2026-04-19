export type Deferred<T> = {
    promise: Promise<T>
    resolve: (value: T) => void
    reject: (reason?: unknown) => void
}

/**
 * ### Cria uma Promise Deferred
 * > Promise deferred é uma promessa adiada para ser controlada de forma remota.
 * @returns Promise Deferred
 */
export function createDeferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void
    let reject!: (reason?: unknown) => void

    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })

    return { promise, resolve, reject }
}
