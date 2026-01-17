import React from "react";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { ThemeProvider } from "next-themes";

export default function DemoTwo() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="h-screen w-screen flex flex-col gap-8 items-center justify-center relative bg-black overflow-hidden">
                <div className="absolute inset-0">
                    <DotScreenShader />
                </div>
                {/* Text removed as per request */}
            </div>
        </ThemeProvider>
    );
}
