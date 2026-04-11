export default function Validations(props: { errMsgs: string[] }) {
    return (
        props.errMsgs.length > 0 &&
        (
            <div class="notification is-danger is-dark">
                <ul>
                    {props.errMsgs.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
            </div>
        )
    )
}
