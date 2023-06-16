import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const IndexPage: React.FC = () => {

    const [count, setCount] = useState(1);

    useEffect(() => {
        console.log("[] effect");
        return () => {
            console.log("[] cleanup");
        };
    }, []);

    useEffect(() => {
        console.log("[count] effect");
        return () => {
            console.log("[count] cleanup");
        };
    },[count]);
        

    return (
        count ? (<div>
            <button onClick={()=>setCount(count-1)}>-1{count}</button>
            <button onClick={()=>{
                // const root= createRoot(document.getElementById("root") as HTMLElement);
                // root.unmount();
                document.getElementById("root")?.removeChild(document.getElementById("root")?.firstChild as Node);
            }}>卸载</button>
            <h1>IndexPage</h1>
        </div>) : null
    );
};

export default IndexPage;