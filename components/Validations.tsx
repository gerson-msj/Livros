export default function Validations(props: { validations: string[] }) {
  return (
    props.validations.length > 0 &&
    (
      <div class="notification is-danger is-light">
        <ul>
          {props.validations.map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      </div>
    )
  )
}
