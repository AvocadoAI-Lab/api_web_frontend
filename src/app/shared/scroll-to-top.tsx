'use client'
import { Button, ButtonProps } from "./button";
import { useEffect, useState } from "react"

export function ScrollToTop({
    minHeight, // Height from which button will be visible
    scrollTo, // Height to go on scroll to top
    ...props
}: ButtonProps & { minHeight?: number; scrollTo?: number }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(document.documentElement.scrollTop >= (minHeight ?? 0));
        };

        onScroll();
        document.addEventListener("scroll", onScroll);

        return () => document.removeEventListener("scroll", onScroll);
    }, [minHeight]);

    return (
        <>
            {visible && (
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                    onClick={() =>
                        window.scrollTo({
                            top: scrollTo ?? 0,
                            behavior: "smooth",
                        })
                    }
                    {...props}
                />
            )}
        </>
    );
}
