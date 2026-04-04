import { LayoutConfig } from "fresh"
import { define } from "../../utils.ts"

export const config: LayoutConfig = {
    skipInheritedLayouts: true
}

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
