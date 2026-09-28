import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
    const [search, setSearch]= useState("");
    const [problems, setProblems] = useState([]);
    const [selectedRating, setSelectedRating]= useState("All");
    const [hoveredProblem, setHoveredProblem]= useState(null);
    const [syncMessage, setSyncMessage]= useState("");
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced]= useState(null);
    const ratings= [
        "All",
        ...new Set(
            problems
                .map((problem) => problem.rating)
                .filter((rating) => rating)
                .sort((a, b) => a-b)
        )
    ];

    const tags= [
        "All",
        ...new Set(
            problems
                .flatMap((problem) => problem.tags)
                .sort()
        )
    ];

    const [selectedTag, setSelectedTag] = useState("All");

    useEffect(() => {
        const fetchProblems= async () => {
            try {
                const response= await api.get("/problems");
                setProblems(response.data);
            } catch(error) {
                console.log(error);
            }
        };
        fetchProblems();
    }, []);

    const syncProblems = async () => {
        try{
            setSyncing(true);
            setSyncMessage("");

            const response= await api.post("/codeforces/sync/hr145cp");
            console.log(response.data);
            
            if(response.data.added === 0){
                setSyncMessage("Already up to date!");
            }else if(response.data.added === 1){
                setSyncMessage("Synced! Added 1 problem");
            }else{
                setSyncMessage(`Synced! Added ${response.data.added} new problems`);
            }
            setLastSynced(new Date());

            const problemsResponse= await api.get("/problems");
            setProblems(problemsResponse.data);
        } catch(error){
            console.log(error);
            setSyncMessage("Sync failed!");
        } finally{
            setSyncing(false);
        }
    };

    const filteredProblems= problems.filter((problem) => {
        const ratingMatch= 
            selectedRating === "All" || problem.rating === selectedRating;

        const tagMatch=
            selectedTag === "All" || problem.tags.includes(selectedTag);

        const searchMatch= 
            problem.name.toLowerCase().includes(search.toLowerCase());

        return ratingMatch && tagMatch && searchMatch;
    });

    const recentProblems = [...problems]
        .filter((problem) => problem.solvedAt)
        .sort((a, b) => new Date(b.solvedAt)- new Date(a.solvedAt))
        .slice(0, 5)

    return (
        <div className= "min-h-screen bg-[#080A0F] text-[#E6E8EB] p-5 md:p-10">
            <div className= "w-full max-w-[1400px] mx-auto">
                <div className= "flex justify-between items-center mb-[30px]">
                    <div>
                        <h1 className= "text-[40px] m-0 text-[#E6E8EB]">
                            Codeforces Tracker
                        </h1>

                        <p className= "text-[#8B919B] mt-2">
                            Tracking my Codeforces journey!
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-[20px] bg-[#11141A] border border-[#242830] text-[#C94B4B] shadow-[0_0_10px_#C94B4B20]">
                        @hr145cp
                    </div>
                    <button
                        onClick={syncProblems}
                        disabled= {syncing}
                        className={`px-4 py-2 rounded-lg border-none text-white font-bold transition-all duration-200 ${
                            syncing
                                ? "bg-[#242830] cursor-not-allowed opacity-70"
                                : "bg-[#C94B4B] cursor-pointer opacity-100 hover:bg-[#D45555] hover:shadow-[0_0_20px_#C94B4B35] active:bg-[#E05A5A] active:text-white"
                        }`}
                    >
                        {syncing ? "Syncing..." : "Sync Codeforces"}
                    </button>
                    {syncMessage && (
                        <p className="text-[#C94B4B] my-2 text-sm font-medium">
                            {syncMessage}
                        </p>
                    )}
                    {lastSynced && (
                        <p className= "text-[#8FA8C2] mt-[5px] text-xs">
                            Last synced: {lastSynced.toLocaleTimeString([], {
                                hour:"2-digit",
                                minute:"2-digit"
                            })}
                        </p>
                    )}
                </div>
                
                <div className= "flex flex-wrap gap-[15px] mb-[25px]">
                    <div className="bg-[#11141A] px-5 py-[15px] rounded-[10px] border border-[#242830] transition-all duration-200 hover:border-[#C94B4B] hover:shadow-[0_0_18px_#3865F640]">
                        <p className= "text-[#9ca3af] m-0">
                            Total Solved
                        </p>

                        <h2 className="mt-[5px] mb-0 text-[#C94B4B]">
                            {problems.length}
                        </h2>
                    </div>
                    <div className="bg-[#11141A] px-5 py-[15px] rounded-[10px] border border-[#242830]">
                        <p className="text-[#9ca3af] m-0">
                            Ratings
                        </p>
                        <h2 className="mt-[5px] mb-0 text-[#C94B4B]">
                            {ratings.length-1}
                        </h2>
                    </div>
                    <div className= "bg-[#11141A] px-5 py-[15px] rounded-[10px] border border-[#242830]">
                        <p className="text-[#9ca3af] m-0">
                            Tags
                        </p>
                        <h2 className="mt-[5px] mb-0 text-[#C94B4B]">
                            {tags.length-1}
                        </h2>
                    </div>
                </div>

                <input 
                    type= "text"
                    placeholder= "Search problem..."
                    value= {search}
                    onChange= {(e) => setSearch(e.target.value)}
                    className="w-full max-w-[700px] box-border p-3 mt-5 mb-[25px] rounded-lg border border-[#242830] bg-[#11141A] text-white text-base outline-none transition-all duration-200 focus:border-[#C94B4B] focus:shadow-[0_0_15px_#3865F680]"
                />
                <div className="mt-[25px] mb-[30px]">
                    <h2 className="mb-[15px] text-[#E6E8EB]">
                        Latest Solved
                    </h2>

                    {recentProblems.map((problem) => (
                        <div
                            key= {problem._id}
                            onMouseEnter= {() => setHoveredProblem(problem._id)}
                            onMouseLeave= {() => setHoveredProblem(null)}
                            className={`bg-[#11141A] p-[10px_15px] mt-2 rounded-lg border transition-all duration-200 ${
                                hoveredProblem === problem._id
                                    ? "border-[#C94B4B] -translate-y-[3px] shadow-[0_0_18px_#C94B4B35]"
                                    : "border-[#242830] translate-y-0"
                            }`}
                        >
                            <a
                                href={problem.problemUrl}
                                target= "_blank"
                                rel= "noreferrer"
                                className="text-[#C94B4B] no-underline transition-colors duration-200 hover:text-[#E05A5A]"
                            >
                                {problem.contestId}{problem.index}- {problem.name}
                            </a>

                            <span className= "text-[#8B919B] ml-2.5 text-[13px]">
                                {new Date(problem.solvedAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}

                </div>
                <div className="mt-[25px] mb-5">
                    <h2 className="mb-2.5 text-[#E6E8EB]">
                        Rating
                    </h2>
                    <div className="flex flex-wrap">
                        {ratings.map((rating) => (
                            <button
                                key= {rating}
                                onClick= {() => setSelectedRating(rating)}
                                className={`px-3.5 py-2 m-[5px] rounded-[20px] border cursor-pointer text-white transition-all duration-200 hover:-translate-y-[2px] ${
                                    selectedRating === rating
                                        ? "bg-[#C94B4B] text-white font-bold border-[#C94B4B] shadow-[0_0_20px_#C94B4B60]"
                                        : "bg-[#171A20] font-normal border-[#242830] hover:bg-[#D4FFFF] hover:border-[#C94B4B] hover:shadow-[0_0_20px_#3865F680] active:bg-[#00D4FF]"
                                }`}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-[30px]">
                    <h2 className="mb-2.5 text-[#E6E8EB]">
                        Tags
                    </h2>
                    <div className="flex flex-wrap">
                        {tags.map((tag) => (
                            <button
                                key= {tag}
                                onClick= {() => setSelectedTag(tag)}
                                className={`px-3.5 py-2 m-[5px] rounded-[20px] border cursor-pointer text-white transition-all duration-200 hover:-translate-y-[2px] ${
                                    selectedTag === tag
                                        ? "bg-[#C94B4B] text-white font-bold border-[#C94B4B] shadow-[0_0_20px_#C94B4B60]"
                                        : "bg-[#171A20] font-normal border-[#242830] hover:bg-[#D4FFFF] hover:border-[#C94B4B] hover:shadow-[0_0_20px_#3865F680] active:bg-[#00D4FF]"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center mt-[30px] mb-2.5">
                    <h2 className="m-0 text-[#E6E8EB]">
                        Problems
                    </h2>
                    <p className= "text-[#8B919B] m-0">
                        Showing {filteredProblems.length} of {problems.length}
                    </p>
                </div>
                {filteredProblems.length === 0 && (
                    <p className="text-[#8B919B] mt-[30px]">
                        No problems found.
                    </p>
                )}
                {filteredProblems.map((problem) => (
                    <div 
                        key= {problem._id}
                        onMouseEnter={() => setHoveredProblem(problem._id)}
                        onMouseLeave={() => setHoveredProblem(null)}
                        className={`bg-[#11141A] p-[15px_18px] mt-2.5 rounded-[10px] border transition-all duration-200 ${
                            hoveredProblem === problem._id
                                ? "border-[#C94B4B] -translate-y-[3px] shadow-[0_0_20px_#C94B4B35]"
                                : "border-[#242830] translate-y-0"
                        }`}
                    >
                        <h3 className="m-0 mb-2.5 text-[18px]">
                            <a 
                                href={problem.problemUrl}
                                target= "_blank"
                                rel="noreferrer"
                                className={`no-underline transition-colors duration-200 ${
                                    hoveredProblem === problem._id
                                        ? "text-[#E05A5A]"
                                        : "text-[#C94B4B]"
                                }`}
                            >
                                {problem.contestId}{problem.index} - {problem.name}
                            </a>
                            
                        </h3>

                        <p className="text-[#9ca3af] my-[5px]">
                            Rating: <span className="text-[#C94B4B] font-semibold">{problem.rating}</span>
                        </p>
                        <p className="text-[#9ca3af] my-[5px]">
                            Solved: <span className="text-[#8B919B]">{new Date(problem.solvedAt).toLocaleDateString()}</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {problem.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-[9px] py-1 rounded-xl bg-[#171A20] text-[#B8BDC7] text-[13px] border border-[#242830] transition-all duration-200 hover:bg-[#242830] hover:border-[#C94B4B] hover:text-white hover:shadow-[0_0_12px_#C94B4B30]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;