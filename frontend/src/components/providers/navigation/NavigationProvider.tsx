import { useEffect, useState } from "react";
import { NavigationContext } from "./NavigationContext";

type NavigationProps = {
    children: React.ReactNode
};
const NavigationProvider: React.FC<NavigationProps> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(window.location.pathname);
    const navigate = (page: string) => {
        setCurrentPage(page);
        window.history.pushState({}, "", page);
    };
    useEffect(() => {
        const onPopState = () => {
            setCurrentPage(window.location.pathname);
        };  
        window.addEventListener("popstate", onPopState);
        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, []);

    return (
        <NavigationContext.Provider value={{ currentPage, navigate }}>
            {children}
        </NavigationContext.Provider>
    )
};
export default NavigationProvider;