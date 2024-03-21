import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import RightSide from "../components/RightSide";
import RightMobile from "../components/RightMobile";
import SyncLoader from "react-spinners/SyncLoader";

const Home = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortingOption, setSortingOption] = useState("latest");

    const handlePost = () => {
        navigate('/create');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!cookies.token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.post(
                    "http://localhost:5000",
                    {},
                    { withCredentials: true }
                );
                const { status, user } = response.data;
                if (status) {
                    setUsername(user.username);
                } else {
                    removeCookie("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cookies, navigate, removeCookie]);

    return (
        <>
            <Navbar username={username} />
            <div className="min-h-screen bg-black flex flex-col md:flex-row items-start justify-center border-slate-600">
                <div className="w-full md:w-1/2 p-4">
                    <div className="border-2 border-slate-600 p-4 rounded flex flex-row md:flex-row items-center justify-between text-white mb-4">
                        <button className="bg-[#1976D2] text-white text-xl font-bold p-2 rounded md:mt-0" onClick={handlePost}>+ New Post</button>
                        <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold">Sort:</p>
                            <select
                                className="text-white font-bold text-xl bg-black border-2 border-slate-600 rounded p-2"
                                onChange={(e) => setSortingOption(e.target.value)}
                            >
                                <option value="latest">Latest</option>
                                <option value="likes">Likes</option>
                                <option value="comments">Comments</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                    <div block><RightMobile /></div>
                    <div style={{textAlign:'center'}}>
                        {loading ? (
                            <SyncLoader color={"#1976D2"} loading={true} size={10} />
                        ) : (
                            <div style={{ textAlign: 'left' }}>
                                <Post username={username} sortingOption={sortingOption} />
                            </div>
                        )}
                    </div>
                </div>
                <RightSide />
            </div>
        </>
    );
};
export default Home;
