import React, { useState, createContext, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
	const [images, setImages] = useState([]);

	return <AppContext.Provider value={images}>{children}</AppContext.Provider>
}
