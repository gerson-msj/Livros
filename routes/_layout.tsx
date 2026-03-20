import { define } from "../utils.ts"

export default define.layout(({ Component }) => {
  return (
    <>
      <div class="container mt-3">
        <div class="box">
          <Component />
        </div>
      </div>
    </>
  )
})
