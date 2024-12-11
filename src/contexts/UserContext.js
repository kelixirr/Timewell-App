import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { customToast } from "../utils/customToast";

const UserContext = createContext();

const defaultUserData = {
  name: "",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : defaultUserData;
    } catch {
      return defaultUserData;
    }
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {}
  }, [user]);

  const updateName = (name) => setUser((prev) => ({ ...prev, name }));

  const updateImage = () => {
    const file = fileInputRef.current?.files[0];

    if (!file) {
      customToast.error("No file selected.");
      return;
    }
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
      customToast.error(
        "Invalid image file. Please upload a JPG, PNG, or GIF."
      );
      return;
    }
    const maxSizeInBytes = 5 * 1024 * 1024; 
    if (file.size > maxSizeInBytes) {
      customToast.error("Image file is too large. Max size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      setUser((prev) => ({ ...prev, image: base64Image }));
      customToast.success("Image updated successfully!");
    };

    reader.onerror = () => {
      customToast.error("Error reading image file.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateName,
        updateImage,
        fileInputRef,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
