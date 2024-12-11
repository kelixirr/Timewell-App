import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        style: {
          fontSize: "1.4rem",
          border: "1px solid #a35028",
        },
        animation: {
          in: "slideInRight",
          out: "slideOutRight",
        },
      }}
    />
  );
}

