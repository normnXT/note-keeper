import {
    useEffect,
    useState,
    useCallback,
    useContext,
} from "react";

import EditorModal from "../components/EditorModal";
import CarouselWrapper from "../components/CarouselWrapper";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import { Context } from "../App";

import axios from "axios";



function Home() {
    const context = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);

    // Checks if notes exist for the current authenticated user on render
    // If the database is slow to respond a loading spinner will display instead of the notes
    const getNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/api/notes', {
                withCredentials: true,
            });
            context.setNotes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getNotes();
    }, [getNotes]);

    // Checks for an active session on render
    const getUserProfile = useCallback(async () => {
        try {
            const res = await axios.get('/api/auth/login/success', {
                withCredentials: true,
            });
            context.setUserData(res.data.user);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        getUserProfile();
    }, [getUserProfile]);


    return (
        <div className="flex flex-col h-lvh gap-4 p-4">
            <EditorModal />
            <Header />
            {isLoading ? <Spinner /> : <CarouselWrapper />}
        </div>
    );
}

export default Home;
