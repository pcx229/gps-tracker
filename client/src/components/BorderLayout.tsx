import { ReactNode, ReactNodeArray } from "react"

function Header({children}: {children?: ReactNode}) {
    return <> {children} </>
}
Header.displayName = "BorderLayout.Header"

function Body({children}: {children?: ReactNode}) {
    return <> {children} </>
}
Body.displayName = "BorderLayout.Body"

function Footer({children, saperator}: {children?: ReactNode, saperator: boolean}) {
    return (
        <> 
            { saperator ? <hr /> : undefined }
            {children} 
        </>
    )
}
Footer.displayName = "BorderLayout.Footer"

export default function BorderLayout({children}: {children?: ReactNode}) {

    function sub(name: string) {
        return (children! as ReactNodeArray).find((child: any) => (child.type?.displayName === ("BorderLayout." + name)))
    }

    return (
        <div>
            <div style={{minHeight: "calc(100vh - 70px)"}}>
                { sub("Header") }
                { sub("Body") }
            </div>
            <div style={{height: "70px"}}>
                { sub("Footer") }
            </div>
        </div>
    )
}

BorderLayout.Header = Header
BorderLayout.Body = Body
BorderLayout.Footer = Footer

