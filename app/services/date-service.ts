export default class DateService {
    private static fatorDia: number = 1000 * 60 * 60 * 24

    public static DataHoraLocal(): Date {
        const now = new Date()
        const brTimezoneOffset = -3 * 60
        return new Date(now.getTime() + (brTimezoneOffset - now.getTimezoneOffset()) * 60000)
    }

    public static DiaAtual(): number {
        const dt = new Date()
        return Math.floor(dt.valueOf() / this.fatorDia)
    }

    public static DiaHoraAtual(): number {
        const dt = new Date()
        const dtValue = dt.valueOf() / this.fatorDia
        return Math.round(dtValue * 100000) / 100000
    }
}
