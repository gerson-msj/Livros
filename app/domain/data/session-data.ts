export default interface ISessionData {
    /** UUID */
    sessionId: string

    /** Id do usuário */
    userId: number

    /** Tempo, em **minutos**, para expiração da sessão. */
    expiresIn: number
}
