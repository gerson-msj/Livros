import type { ComponentChildren } from "preact"
import { useEffect, useRef } from "preact/hooks"

export interface FixedHeaderPageProps {
    header: ComponentChildren
    children: ComponentChildren
    className?: string
    headerClassName?: string
    headerInnerClassName?: string
    contentClassName?: string
}

export default function FixedHeaderPage(
    { header, children, className, headerClassName, headerInnerClassName, contentClassName }: FixedHeaderPageProps
) {
    const rootRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = rootRef.current
        const headerElement = headerRef.current

        if (!root || !headerElement) {
            return
        }

        function updateHeaderHeight() {
            root?.style.setProperty("--livros-fixed-page-header-height", `${headerElement?.getBoundingClientRect().height ?? 0}px`)
        }

        updateHeaderHeight()

        if ("ResizeObserver" in globalThis) {
            const observer = new ResizeObserver(updateHeaderHeight)
            observer.observe(headerElement)

            return () => {
                observer.disconnect()
                root.style.removeProperty("--livros-fixed-page-header-height")
            }
        }

        globalThis.addEventListener("resize", updateHeaderHeight)

        return () => {
            globalThis.removeEventListener("resize", updateHeaderHeight)
            root.style.removeProperty("--livros-fixed-page-header-height")
        }
    }, [])

    return (
        <div ref={rootRef} class={joinClasses("livros-fixed-page", className)}>
            <div ref={headerRef} class={joinClasses("livros-fixed-page-header", headerClassName)}>
                <div class={joinClasses("livros-fixed-page-header-inner", headerInnerClassName)}>
                    {header}
                </div>
            </div>
            <div class={joinClasses("livros-fixed-page-content", contentClassName)}>
                {children}
            </div>
        </div>
    )
}

function joinClasses(...classes: Array<string | undefined>): string {
    return classes.filter(Boolean).join(" ")
}
