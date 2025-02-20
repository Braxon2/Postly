import { useContext } from "react";
import { PostContext } from "../context/PostContext";

export const usePostContext = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw Error("useAuth must be inside PostContextProvider");
  }

  return context;
};
